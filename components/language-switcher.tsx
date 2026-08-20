"use client";

import { useId, useTransition, type ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

function localeName(code: string, uiLocale: string) {
  try {
    const name = new Intl.DisplayNames([uiLocale], { type: "language" }).of(
      code,
    );
    if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    // Intl.DisplayNames no esta disponible: se muestra el codigo.
  }

  return code.toUpperCase();
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("layout");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const selectId = useId();
  const [pending, startTransition] = useTransition();

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    if (next === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className={className ? `idioma ${className}` : "idioma"}>
      <label className="visually-hidden" htmlFor={selectId}>
        {t("language")}
      </label>
      <select
        className="idioma__select"
        id={selectId}
        name="locale"
        value={locale}
        onChange={onChange}
        disabled={pending}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {localeName(code, locale)}
          </option>
        ))}
      </select>
    </div>
  );
}
