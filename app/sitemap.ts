import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { SITE_URL as BASE } from "@/lib/content/site";

const ROUTES = ["", "/about", "/sections", "/join", "/impact", "/projects", "/news"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${BASE}/${locale}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [other, `${BASE}/${other}${route}`]),
        ),
      },
    })),
  );
}
