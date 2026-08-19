import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.home" });

  return { title: t("title"), robots: { index: false, follow: false } };
}

type PendingCounts = {
  minor: number | null;
  volunteer: number | null;
};

async function countPending(): Promise<PendingCounts> {
  try {
    const supabase = createSupabaseServerClient();

    const [minor, volunteer] = await Promise.all([
      supabase
        .from("minor_enrollment_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("volunteer_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    if (minor.error || volunteer.error) {
      console.error("Portal pending counts failed", {
        minor: minor.error?.message,
        volunteer: volunteer.error?.message,
      });
    }

    return {
      minor: minor.error ? null : (minor.count ?? 0),
      volunteer: volunteer.error ? null : (volunteer.count ?? 0),
    };
  } catch (error) {
    console.error("Portal pending counts unavailable", error);
    return { minor: null, volunteer: null };
  }
}

export default async function PortalHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("portal.home");
  const counts = await countPending();

  const cards = [
    {
      key: "minor" as const,
      count: counts.minor,
      href: "/portal/solicitudes",
    },
    {
      key: "volunteer" as const,
      count: counts.volunteer,
      href: "/portal/solicitudes",
    },
  ];

  return (
    <>
      <p className="eyebrow eyebrow--green">{t("eyebrow")}</p>
      <h1 className="title-md" style={{ marginTop: 8 }}>
        {t("title")}
      </h1>
      <p className="prose" style={{ marginTop: 8 }}>
        {t("lead")}
      </p>

      <div className="portal-resumen">
        {cards.map((card) => (
          <article className="card portal-resumen__card" key={card.key}>
            <p className="portal-resumen__etiqueta">
              {t(`cards.${card.key}.label`)}
            </p>
            <p className="portal-resumen__valor">
              {card.count === null ? t("unavailable") : card.count}
            </p>
            <p className="portal-resumen__detalle">
              {t(`cards.${card.key}.detail`)}
            </p>
            <Link className="link-arrow" href={card.href}>
              {t("cards.action")}
            </Link>
          </article>
        ))}

        <article className="card portal-resumen__card">
          <p className="portal-resumen__etiqueta">{t("cards.users.label")}</p>
          <p className="portal-resumen__detalle">{t("cards.users.detail")}</p>
          <Link className="link-arrow" href="/portal/usuarios">
            {t("cards.users.action")}
          </Link>
        </article>
      </div>

      <p className="portal-nota">{t("scopeNote")}</p>
    </>
  );
}
