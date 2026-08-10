/**
 * Translation completeness tests.
 *
 * Ensures every key present in en.json (the source of truth) also exists in
 * every other locale file, and that translated string values are non-empty.
 *
 * The helper `collectLeafKeys` walks the JSON tree recursively so nested
 * namespaces like `about.step1` are checked individually.
 */

import en from "@/messages/en.json";
import hy from "@/messages/hy.json";

type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;

/**
 * Returns all dot-separated leaf key paths from a (potentially nested) object,
 * skipping empty objects (namespaces with no keys defined).
 */
function collectLeafKeys(obj: JsonObject, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      const nested = collectLeafKeys(v as JsonObject, path);
      // Only add the namespace itself as a leaf when it has no children with values
      if (nested.length === 0) {
        keys.push(path);
      } else {
        keys.push(...nested);
      }
    } else {
      keys.push(path);
    }
  }
  return keys;
}

/**
 * Retrieves a value from a nested object using a dot-separated path.
 */
function getByPath(obj: JsonObject, path: string): JsonValue | undefined {
  return path.split(".").reduce<JsonValue | undefined>((acc, key) => {
    if (acc !== null && typeof acc === "object" && !Array.isArray(acc)) {
      return (acc as JsonObject)[key];
    }
    return undefined;
  }, obj);
}

const enKeys = collectLeafKeys(en as JsonObject);

describe("hy.json translation completeness", () => {
  it("has the same top-level namespaces as en.json", () => {
    const enNamespaces = Object.keys(en);
    const hyNamespaces = Object.keys(hy);
    expect(hyNamespaces).toEqual(expect.arrayContaining(enNamespaces));
  });

  it("contains every leaf key that en.json defines", () => {
    const missingKeys = enKeys.filter(
      (key) => getByPath(hy as JsonObject, key) === undefined
    );
    expect(missingKeys).toEqual([]);
  });

  it("has no empty string values for translated keys", () => {
    const emptyKeys = enKeys.filter((key) => {
      const hyVal = getByPath(hy as JsonObject, key);
      // Only flag string values that are empty; non-string leaves (numbers, booleans) are fine
      return typeof hyVal === "string" && hyVal.trim() === "";
    });
    expect(emptyKeys).toEqual([]);
  });

  // Spot-check critical nav keys
  describe("nav namespace", () => {
    it("translates nav.home", () => {
      expect((hy.nav as Record<string, string>).home).toBeTruthy();
    });

    it("translates nav.blog", () => {
      expect((hy.nav as Record<string, string>).blog).toBeTruthy();
    });

    it("translates nav.about", () => {
      expect((hy.nav as Record<string, string>).about).toBeTruthy();
    });

    it("translates nav.tags", () => {
      expect((hy.nav as Record<string, string>).tags).toBeTruthy();
    });

    it("translates nav.login", () => {
      expect((hy.nav as Record<string, string>).login).toBeTruthy();
    });
  });

  // Spot-check blog namespace
  describe("blog namespace", () => {
    it("translates blog.readMore", () => {
      expect((hy.blog as Record<string, string>).readMore).toBeTruthy();
    });

    it("translates blog.minRead", () => {
      expect((hy.blog as Record<string, string>).minRead).toBeTruthy();
    });
  });

  // Spot-check about namespace
  describe("about namespace", () => {
    it("translates about.title", () => {
      expect((hy.about as Record<string, string>).title).toBeTruthy();
    });

    it("translates about.noticeTitle", () => {
      expect((hy.about as Record<string, string>).noticeTitle).toBeTruthy();
    });

    it("translates all three process steps", () => {
      const about = hy.about as Record<string, string>;
      expect(about.step1).toBeTruthy();
      expect(about.step2).toBeTruthy();
      expect(about.step3).toBeTruthy();
    });
  });
});

describe("en.json integrity", () => {
  it("has no empty string values", () => {
    const emptyKeys = enKeys.filter((key) => {
      const val = getByPath(en as JsonObject, key);
      return typeof val === "string" && val.trim() === "";
    });
    expect(emptyKeys).toEqual([]);
  });

  it("defines all expected namespaces", () => {
    expect(Object.keys(en)).toEqual(
      expect.arrayContaining(["nav", "login", "blog", "about"])
    );
  });
});
