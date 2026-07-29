import { getTranslations } from "next-intl/server";

import { IconConstruction } from "@/components/icons";

export async function PendingValue({ children }: { children?: string }) {
  const t = await getTranslations("pending");

  return (
    <span className="por-confirmar" title={t("hint")}>
      {children ?? t("label")}
    </span>
  );
}

export async function PendingNote({ text }: { text?: string }) {
  const t = await getTranslations("pending");

  return (
    <div className="por-confirmar-nota">
      <span className="por-confirmar-nota__icono" aria-hidden="true">
        <IconConstruction size={20} />
      </span>
      <p>{text ?? t("block")}</p>
    </div>
  );
}
