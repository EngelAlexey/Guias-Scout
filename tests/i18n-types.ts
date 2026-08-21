import { getTranslations } from "next-intl/server";

// Este contrato solo se compila; Vitest no lo ejecuta. Si la ampliación de
// next-intl deja de cargar, la directiva @ts-expect-error queda sin uso y
// TypeScript falla, evitando que se pierda la validación estricta de llaves.
export async function verifyI18nKeyTypes() {
  const t = await getTranslations();

  t("site.name");

  // @ts-expect-error Esta llave debe permanecer inválida.
  t("site.__missing_translation_contract__");
}
