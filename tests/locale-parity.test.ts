import { describe, expect, it } from "vitest";

import en from "../messages/en.json";
import es from "../messages/es.json";

type MessageNode = null | boolean | number | string | MessageNode[] | {
  [key: string]: MessageNode;
};

function collectShape(
  value: MessageNode,
  path = "root",
  result: string[] = [],
): string[] {
  if (Array.isArray(value)) {
    result.push(`${path}:array`);
    value.forEach((item, index) => collectShape(item, `${path}.${index}`, result));
    return result;
  }

  if (typeof value === "object" && value !== null) {
    result.push(`${path}:object`);
    Object.entries(value).forEach(([key, item]) =>
      collectShape(item, `${path}.${key}`, result),
    );
    return result;
  }

  result.push(`${path}:${typeof value}`);
  return result;
}

function collectStrings(
  value: MessageNode,
  path = "root",
  result: Map<string, string> = new Map(),
): Map<string, string> {
  if (typeof value === "string") {
    result.set(path, value);
    return result;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}.${index}`, result));
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, item]) =>
      collectStrings(item, `${path}.${key}`, result),
    );
  }

  return result;
}

function messageTokens(value: string): string[] {
  return value.match(/<\/?[a-z]+>|\{[a-zA-Z][a-zA-Z0-9]*\}/g)?.sort() ?? [];
}

describe("English catalog parity", () => {
  it("has exactly the same keys, arrays, and pending gaps as Spanish", () => {
    expect(collectShape(en as MessageNode)).toEqual(collectShape(es as MessageNode));
  });

  it("preserves interpolation and rich-text tokens", () => {
    const englishStrings = collectStrings(en as MessageNode);
    const spanishStrings = collectStrings(es as MessageNode);

    for (const [path, spanishValue] of spanishStrings) {
      const englishValue = englishStrings.get(path);
      expect(englishValue, `Missing English message at ${path}`).toBeDefined();
      expect(messageTokens(englishValue ?? ""), `Token mismatch at ${path}`).toEqual(
        messageTokens(spanishValue),
      );
    }
  });

  it("keeps confirmed institutional wording and required names unchanged", () => {
    expect(en.site.name).toBe(es.site.name);
    expect(en.site.shortName).toBe(es.site.shortName);
    expect(en.content.promise).toBe(es.content.promise);
    expect(en.content.scoutLaw).toEqual(es.content.scoutLaw);
    expect(en.projects.items[0].name).toBe(es.projects.items[0].name);

    for (const section of ["manada", "tropa", "wak", "comunidad"] as const) {
      expect(en.content.sections[section].name).toBe(
        es.content.sections[section].name,
      );
    }
  });

  it("translates every current stock-photo description", () => {
    const englishStrings = collectStrings(en as MessageNode);
    const spanishStrings = collectStrings(es as MessageNode);
    const imageAltPaths = [...spanishStrings.keys()].filter((path) =>
      path.endsWith("imageAlt"),
    );

    expect(imageAltPaths.length).toBeGreaterThan(0);
    for (const path of imageAltPaths) {
      expect(englishStrings.get(path), path).not.toBe(spanishStrings.get(path));
    }
  });
});
