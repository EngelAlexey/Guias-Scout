import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/content/site";

const PRIVATE_ROUTES = ["/impact", "/projects", "/news", "/design-system"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: routing.locales.flatMap((locale) =>
        PRIVATE_ROUTES.map((route) => `/${locale}${route}`),
      ),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
