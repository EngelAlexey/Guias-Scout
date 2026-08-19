import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <section className="section--cream">
      <div className="container construccion">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="title-lg" style={{ marginTop: 12 }}>
          {t("title")}
        </h1>
        <p className="lead">{t("lead")}</p>
        <div className="btn-row btn-row--center">
          <Link className="btn" href="/">
            {t("backHome")}
          </Link>
          <Link className="btn btn--ghost" href="/sections">
            {t("sections")}
          </Link>
        </div>
      </div>
    </section>
  );
}
