import { describe, expect, it } from "vitest";

import {
  FOOTER_NAV,
  FOOTER_TRANSPARENCY,
  NAV_ITEMS,
  SDG,
  SECTION_IDS,
} from "../lib/content/site";
import en from "../messages/en.json";
import es from "../messages/es.json";

type MessageTree = Record<string, unknown>;

function resolveMessage(messages: MessageTree, key: string): unknown {
  return key.split(".").reduce<unknown>((node, segment) => {
    if (
      (typeof node !== "object" || node === null) &&
      !Array.isArray(node)
    ) {
      return undefined;
    }

    return (node as MessageTree)[segment];
  }, messages);
}

const catalogs = { en, es } satisfies Record<string, MessageTree>;

const navKeys = [...NAV_ITEMS, ...FOOTER_NAV, ...FOOTER_TRANSPARENCY].map(
  ({ key }) => `nav.${key}`,
);

const sectionFields = [
  "name",
  "ages",
  "agesShort",
  "summary",
  "description",
  "unit",
  "focus",
  "imageAlt",
] as const;

const sectionKeys = SECTION_IDS.flatMap((section) =>
  sectionFields.map((field) => `content.sections.${section}.${field}`)
);

const pillarKeys = ["education", "outdoors", "service"].flatMap((pillar) => [
  `home.method.pillars.${pillar}.title`,
  `home.method.pillars.${pillar}.text`,
]);

const volunteerRoleKeys = ["leader", "collab", "band", "notSure"].map(
  (role) => `forms.volunteer.options.${role}`,
);

const projectStatusKeys = ["active", "done"].map(
  (status) => `projects.status.${status}`,
);

const sdgKeys = SDG.map((_item, index) => `content.sdg.${index}.label`);

const dynamicKeys = [
  ...new Set([
    ...navKeys,
    ...sectionKeys,
    ...pillarKeys,
    ...volunteerRoleKeys,
    ...projectStatusKeys,
    ...sdgKeys,
  ]),
].sort();

describe("dynamic i18n keys", () => {
  it.each(
    Object.entries(catalogs).flatMap(([locale, messages]) =>
      dynamicKeys.map((key) => ({ key, locale, messages })),
    ),
  )("resolves $key in $locale", ({ key, messages }) => {
    const value = resolveMessage(messages, key);

    expect(value, `Missing translation key: ${key}`).toBeTypeOf("string");
    expect(String(value).trim(), `Empty translation key: ${key}`).not.toBe("");
  });
});
