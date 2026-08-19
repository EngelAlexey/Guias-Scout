export type PortalNavItem = {
  href: string;
  key: string;
};

export const PORTAL_NAV_ITEMS: PortalNavItem[] = [
  { href: "/portal", key: "home" },
  { href: "/portal/solicitudes", key: "submissions" },
  { href: "/portal/usuarios", key: "users" },
];

export const SUBMISSION_STATUSES = [
  "pending",
  "contacted",
  "accepted",
  "rejected",
  "archived",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
