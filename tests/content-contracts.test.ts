import { describe, expect, it } from "vitest";

import {
  AGENDA_TONES,
  SDG,
  SECTION_IDS,
  TEAM_SECTIONS,
} from "../lib/content/site";
import en from "../messages/en.json";
import es from "../messages/es.json";

const catalogs = { en, es };

describe("indexed content contracts", () => {
  for (const [locale, messages] of Object.entries(catalogs)) {
    it.each([
      ["SDG/content.sdg", SDG, messages.content.sdg],
      ["TEAM_SECTIONS/content.team", TEAM_SECTIONS, messages.content.team],
      ["AGENDA_TONES/content.agenda", AGENDA_TONES, messages.content.agenda],
    ])(`keeps %s aligned in ${locale}`, (_name, structuralItems, translatedItems) => {
      expect(structuralItems).toHaveLength(translatedItems.length);
    });
  }

  it("only references known sections from TEAM_SECTIONS", () => {
    const knownSections = new Set<string>(SECTION_IDS);

    for (const section of TEAM_SECTIONS) {
      expect(section === undefined || knownSections.has(section)).toBe(true);
    }
  });

  it("only uses supported agenda tones", () => {
    const supportedTones = new Set(["amber", "green", undefined]);

    for (const tone of AGENDA_TONES) {
      expect(supportedTones.has(tone)).toBe(true);
    }
  });
});
