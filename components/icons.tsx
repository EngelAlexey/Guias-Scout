import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconLeaf(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    </Icon>
  );
}

export function IconPaw(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="7" cy="9" r="1.7" />
      <circle cx="12" cy="7.5" r="1.9" />
      <circle cx="17" cy="9" r="1.7" />
      <path d="M9 15.5c1-1.8 1.8-2.8 3-2.8s2 1 3 2.8c.7 1.3 1.4 2 1.4 3.2 0 1.4-1.2 2.3-2.6 2-.7-.15-1.2-.5-1.8-.5s-1.1.35-1.8.5c-1.4.3-2.6-.6-2.6-2 0-1.2.7-1.9 1.4-3.2Z" />
    </Icon>
  );
}

export function IconTent(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 21 14 3" />
      <path d="M20.5 21 10 3" />
      <path d="M12 15l-3.5 6h7Z" />
      <path d="M2 21h20" />
    </Icon>
  );
}

export function IconCompass(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="16 8 13.7 13.7 8 16 10.3 10.3" />
    </Icon>
  );
}

export function IconCampfire(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
    </Icon>
  );
}

export function IconBook(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </Icon>
  );
}

export function IconMountain(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m8 21 4-9 4 9" />
      <path d="M12 12 6.5 3 2 21h20L17.5 3 12 12Z" />
    </Icon>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" />
    </Icon>
  );
}

export function IconTarget(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </Icon>
  );
}

export function IconEye(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z" />
    </Icon>
  );
}

export function IconLocation(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.9" />
    </Icon>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 3 5.7 2.5 2.5 0 0 1 5.5 3Z" />
    </Icon>
  );
}

export function IconConstruction(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.9}>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M9.5 21v-6h5v6" />
    </Icon>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={2.2}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={2.2}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </Icon>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.9}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.4 0-4.05 1.47-4.05 4.18v2.25H7.5V13h2.7v8h3.3Z" />
    </Icon>
  );
}

export function IconYouTube(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.78C18.3 5 12 5 12 5s-6.3 0-7.85.42A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.78C5.7 19 12 19 12 19s6.3 0 7.85-.42a2.5 2.5 0 0 0 1.75-1.78A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </Icon>
  );
}

export const SOCIAL_ICONS = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  youtube: IconYouTube,
} as const;
