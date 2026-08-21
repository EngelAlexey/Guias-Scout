import { describe, expect, it } from "vitest";

import sitemap from "../app/sitemap";

const routes = ["", "/about", "/sections", "/join", "/impact", "/projects", "/news"];
const locales = ["es", "en"];

describe("localized sitemap", () => {
  it("publishes every route in Spanish and English with reciprocal hreflang links", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(routes.length * locales.length);

    for (const route of routes) {
      for (const locale of locales) {
        const entry = entries.find(({ url }) => url.endsWith(`/${locale}${route}`));

        expect(entry, `Missing /${locale}${route || " (home)"}`).toBeDefined();
        const base = new URL(entry?.url ?? "http://localhost").origin;
        expect(entry?.alternates?.languages).toEqual({
          es: `${base}/es${route}`,
          en: `${base}/en${route}`,
        });
      }
    }
  });
});
