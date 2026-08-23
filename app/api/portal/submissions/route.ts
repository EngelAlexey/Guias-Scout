import { NextResponse } from "next/server";

import { getPortalSession } from "@/lib/portal/session";
import {
  isSubmissionStatus,
  isSubmissionType,
  SUBMISSION_LIMIT,
  type PortalSubmission,
  type SubmissionType,
} from "@/lib/portal/submissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type JsonObject = Record<string, unknown>;

type MinorRow = {
  id: string;
  minor_name: string;
  birth_date: string;
  guardian_name: string;
  phone: string;
  email: string | null;
  section_interest: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type VolunteerRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  role_interest: string;
  motivation: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const TABLES: Record<SubmissionType, string> = {
  minor: "minor_enrollment_submissions",
  volunteer: "volunteer_submissions",
};

const MINOR_COLUMNS =
  "id, minor_name, birth_date, guardian_name, phone, email, section_interest, message, status, created_at, updated_at";
const VOLUNTEER_COLUMNS =
  "id, full_name, phone, email, role_interest, motivation, status, created_at, updated_at";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidRequest() {
  return NextResponse.json(
    { ok: false, error: "invalid_request" },
    { status: 400 },
  );
}

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "unauthorized" },
    { status: 401 },
  );
}

function notFound() {
  return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
}

function storageError() {
  return NextResponse.json(
    { ok: false, error: "storage_error" },
    { status: 500 },
  );
}

function serviceUnavailable() {
  return NextResponse.json(
    { ok: false, error: "service_unavailable" },
    { status: 503 },
  );
}

function logFailure(scope: string, error: { code?: string; message: string }) {
  console.error(scope, { code: error.code, message: error.message });
}

function fromMinorRow(row: MinorRow): PortalSubmission {
  return {
    id: row.id,
    type: "minor",
    status: isSubmissionStatus(row.status) ? row.status : "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.minor_name,
    guardianName: row.guardian_name,
    phone: row.phone,
    email: row.email,
    birthDate: row.birth_date,
    sectionInterest: row.section_interest,
    roleInterest: null,
    message: row.message,
  };
}

function fromVolunteerRow(row: VolunteerRow): PortalSubmission {
  return {
    id: row.id,
    type: "volunteer",
    status: isSubmissionStatus(row.status) ? row.status : "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.full_name,
    guardianName: null,
    phone: row.phone,
    email: row.email,
    birthDate: null,
    sectionInterest: null,
    roleInterest: row.role_interest,
    message: row.motivation,
  };
}

async function readBody(request: Request): Promise<JsonObject | null> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) return null;

  try {
    const body: unknown = await request.json();
    return isObject(body) ? body : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const session = await getPortalSession();
    if (!session) return unauthorized();

    const params = new URL(request.url).searchParams;

    const typeParam = params.get("type");
    if (typeParam !== null && typeParam !== "all" && !isSubmissionType(typeParam)) {
      return invalidRequest();
    }

    const statusParam = params.get("status");
    if (
      statusParam !== null &&
      statusParam !== "all" &&
      !isSubmissionStatus(statusParam)
    ) {
      return invalidRequest();
    }

    const wantedType = typeParam && typeParam !== "all" ? typeParam : null;
    const wantedStatus = statusParam && statusParam !== "all" ? statusParam : null;

    const supabase = createSupabaseServerClient();

    function selectFrom(type: SubmissionType, columns: string) {
      const query = supabase
        .from(TABLES[type])
        .select(columns)
        .order("created_at", { ascending: false })
        .limit(SUBMISSION_LIMIT);

      return wantedStatus ? query.eq("status", wantedStatus) : query;
    }

    const [minor, volunteer] = await Promise.all([
      wantedType === "volunteer"
        ? null
        : selectFrom("minor", MINOR_COLUMNS),
      wantedType === "minor"
        ? null
        : selectFrom("volunteer", VOLUNTEER_COLUMNS),
    ]);

    if (minor?.error) {
      logFailure("Portal submissions listing failed", minor.error);
      return storageError();
    }

    if (volunteer?.error) {
      logFailure("Portal submissions listing failed", volunteer.error);
      return storageError();
    }

    const minorRows = (minor?.data ?? []) as unknown as MinorRow[];
    const volunteerRows = (volunteer?.data ?? []) as unknown as VolunteerRow[];

    const items = [
      ...minorRows.map(fromMinorRow),
      ...volunteerRows.map(fromVolunteerRow),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // Con el tope alcanzado quedan solicitudes fuera de la vista; la interfaz
    // pide filtrar en lugar de mostrar una lista incompleta en silencio.
    const truncated =
      minorRows.length >= SUBMISSION_LIMIT ||
      volunteerRows.length >= SUBMISSION_LIMIT;

    return NextResponse.json({
      ok: true,
      items: items.slice(0, SUBMISSION_LIMIT),
      truncated: truncated || items.length > SUBMISSION_LIMIT,
    });
  } catch (error) {
    console.error("Portal submissions listing unavailable", error);
    return serviceUnavailable();
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getPortalSession();
    if (!session) return unauthorized();

    const body = await readBody(request);
    if (!body) return invalidRequest();

    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!UUID_PATTERN.test(id)) return invalidRequest();

    if (!isSubmissionType(body.type)) return invalidRequest();
    if (!isSubmissionStatus(body.status)) return invalidRequest();

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from(TABLES[body.type])
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, status, updated_at")
      .maybeSingle();

    if (error) {
      logFailure("Portal submission update failed", error);
      return storageError();
    }

    if (!data) return notFound();

    return NextResponse.json({
      ok: true,
      status: data.status as string,
      updatedAt: data.updated_at as string,
    });
  } catch (error) {
    console.error("Portal submission update unavailable", error);
    return serviceUnavailable();
  }
}
