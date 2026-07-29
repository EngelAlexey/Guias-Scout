export const SECTION_IDS = ["manada", "tropa", "wak", "comunidad"] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type NavItem = {
  href: string;
  key: string;
  pending?: boolean;
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/sections", key: "sections" },
  { href: "/impact", key: "impact", pending: true },
  { href: "/projects", key: "projects", pending: true },
  { href: "/news", key: "news", pending: true },
];

export const FOOTER_NAV: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/sections", key: "sections" },
  { href: "/join", key: "join" },
];

export const FOOTER_TRANSPARENCY: NavItem[] = [
  { href: "/impact", key: "impact" },
  { href: "/projects", key: "projects" },
  { href: "/news", key: "news" },
  { href: "/design-system", key: "designSystem" },
];

export const SECTION_IMAGES: Record<SectionId, string> = {
  manada:
    "https://images.unsplash.com/photo-1457530378978-8bac673b8062?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  tropa:
    "https://images.unsplash.com/photo-1627259580535-805b57c2ca8d?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  wak: "https://images.unsplash.com/photo-1528122819723-9dca3a31295d?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  comunidad:
    "https://images.unsplash.com/photo-1636247640133-c57bd4bdee4f?fm=jpg&q=75&w=1200&auto=format&fit=crop",
};

export const PAGE_IMAGES = {
  hero: "https://images.unsplash.com/photo-1681821971952-c769ea78e50e?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  method:
    "https://images.unsplash.com/photo-1643730484055-abc29f2de73c?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  aboutHero:
    "https://images.unsplash.com/photo-1719559519360-02486e77ef13?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  history:
    "https://images.unsplash.com/photo-1603714196939-6f6436c8d0c5?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  sectionsHero:
    "https://images.unsplash.com/photo-1643730484055-abc29f2de73c?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  joinHero:
    "https://images.unsplash.com/photo-1528122819723-9dca3a31295d?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  venue:
    "https://images.unsplash.com/photo-1457530378978-8bac673b8062?fm=jpg&q=75&w=1000&auto=format&fit=crop",
} as const;

export const PALETTE_HEX = [
  "#2E1A47",
  "#5B2D8E",
  "#F2A900",
  "#2E7D4F",
  "#FAF8F3",
  "#5B5169",
];

export const SDG = [
  { number: "4", hex: "#C5192D" },
  { number: "13", hex: "#3F7E44" },
  { number: "17", hex: "#19486A" },
];
