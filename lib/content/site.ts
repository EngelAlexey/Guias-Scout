export const SECTION_IDS = ["manada", "tropa", "wak", "comunidad"] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type NavKey =
  | "home"
  | "about"
  | "sections"
  | "join"
  | "impact"
  | "projects"
  | "news"
  | "credits";

export type NavItem = {
  href: string;
  key: NavKey;
};

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = rawSiteUrl ? rawSiteUrl : "http://localhost:3000";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/sections", key: "sections" },
  { href: "/impact", key: "impact" },
  { href: "/projects", key: "projects" },
  { href: "/news", key: "news" },
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
  { href: "/credits", key: "credits" },
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
  impactHero:
    "https://images.unsplash.com/photo-1643730484055-abc29f2de73c?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  projectsHero:
    "https://images.unsplash.com/photo-1719559519360-02486e77ef13?fm=jpg&q=75&w=1000&auto=format&fit=crop",
  newsHero:
    "https://images.unsplash.com/photo-1603714196939-6f6436c8d0c5?fm=jpg&q=75&w=1000&auto=format&fit=crop",
} as const;

export const SDG = [
  { number: "4", hex: "#C5192D" },
  { number: "13", hex: "#3F7E44" },
  { number: "17", hex: "#19486A" },
];

// Enlace de contacto. El numero visible vive en messages/es.json; aca solo el URI.
export const CONTACT = {
  phoneHref: "tel:+50660101502",
  email: "grupo35@siemprelistos.org",
  emailHref: "mailto:grupo35@siemprelistos.org",
} as const;

// Paralelos por indice a content.team[] y content.agenda[] de messages/es.json,
// igual que SDG lo es a content.sdg[]. Si cambia el largo de uno hay que cambiar
// el del otro: TypeScript no lo detecta.
export const TEAM_SECTIONS: readonly (SectionId | undefined)[] = [
  undefined,
  "tropa",
];

export const AGENDA_TONES: readonly (string | undefined)[] = [
  "amber",
  undefined,
  undefined,
  "green",
];

// Paralelos por indice a credits.people[] y credits.programme[] de
// messages/es.json. El nombre, la URL y el texto visible del enlace no se
// traducen, asi que viven aqui; el rol y el rotulo salen del catalogo.
export type CreditsLink = {
  href: string;
  linkText: string;
  external: boolean;
};

export const CREDITS_TEAM: readonly (CreditsLink & { name: string })[] = [
  {
    name: "Alex Herrera Manzanares",
    href: "https://www.alexherrera.dev",
    linkText: "alexherrera.dev",
    external: true,
  },
  {
    name: "Megan Castro",
    href: "mailto:meganfabicastro@gmail.com",
    linkText: "meganfabicastro@gmail.com",
    external: false,
  },
  {
    name: "Sergio Quesada",
    href: "mailto:sqada2804@gmail.com",
    linkText: "sqada2804@gmail.com",
    external: false,
  },
];

export const CREDITS_INSTITUTIONS: readonly CreditsLink[] = [
  { href: "https://www.utn.ac.cr", linkText: "utn.ac.cr", external: true },
  { href: "https://www.utn.ac.cr/tcu", linkText: "utn.ac.cr/tcu", external: true },
];
