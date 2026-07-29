import { getTranslations } from "next-intl/server";

import { IconConstruction } from "@/components/icons";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  description: string;
};

export async function UnderConstruction({ title, description }: Props) {
  const t = await getTranslations("underConstruction");

  return (
    <section className="section--cream">
      <div className="container construccion">
        <div className="icon-badge">
          <IconConstruction size={36} />
        </div>
        <h1 className="title-lg">{title}</h1>
        <p className="lead">{description}</p>
        <div className="btn-row btn-row--center">
          <Link className="btn" href="/">
            {t("backHome")}
          </Link>
          <Link className="btn btn--ghost" href="/design-system">
            {t("designSystem")}
          </Link>
        </div>
      </div>
    </section>
  );
}
