export type PortalNavItem = {
  href: string;
  key: string;
};

/**
 * Secciones del portal. Vive fuera de `session.ts` porque el encabezado corre
 * en el navegador y esa otra parte es solo de servidor.
 */
export const PORTAL_NAV_ITEMS: PortalNavItem[] = [
  { href: "/portal", key: "home" },
  { href: "/portal/solicitudes", key: "submissions" },
  { href: "/portal/usuarios", key: "users" },
];

/** Estados posibles de una solicitud, en el orden en que suelen ocurrir. */
export const SUBMISSION_STATUSES = [
  "pending",
  "contacted",
  "accepted",
  "rejected",
  "archived",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
