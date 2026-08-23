import { SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/portal/nav";

export { SUBMISSION_STATUSES };
export type { SubmissionStatus };

export const SUBMISSION_TYPES = ["minor", "volunteer"] as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

/** Cuántas solicitudes devuelve la API antes de pedir que se filtre más. */
export const SUBMISSION_LIMIT = 200;

/**
 * Forma común para las dos tablas: la vista del portal es una sola lista y
 * necesita las mismas columnas para inscripciones y voluntariados.
 */
export type PortalSubmission = {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  /** Persona interesada: la menor en inscripciones, la adulta en voluntariado. */
  name: string;
  /** Persona encargada. Solo aplica a inscripciones de personas menores. */
  guardianName: string | null;
  phone: string;
  email: string | null;
  birthDate: string | null;
  sectionInterest: string | null;
  roleInterest: string | null;
  message: string | null;
};

export function isSubmissionType(value: unknown): value is SubmissionType {
  return (
    typeof value === "string" &&
    (SUBMISSION_TYPES as readonly string[]).includes(value)
  );
}

export function isSubmissionStatus(value: unknown): value is SubmissionStatus {
  return (
    typeof value === "string" &&
    (SUBMISSION_STATUSES as readonly string[]).includes(value)
  );
}
