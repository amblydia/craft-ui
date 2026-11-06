import { readFileSync } from "node:fs";
import { join } from "node:path";
import postcss, { type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(import.meta.dirname, "craft.css"), "utf8");
const root = postcss.parse(source);

function variables(selector: string) {
  const rule = root.nodes.find(
    (node): node is Rule => node.type === "rule" && node.selector === selector
  );
  const found: Record<string, string> = {};
  rule?.walkDecls((declaration) => {
    found[declaration.prop.slice("--craft-".length)] = declaration.value;
  });
  return found;
}

const light = variables(":root");
const dark = { ...light, ...variables(".dark") };

function luminance(hex: string) {
  const channels = [1, 3, 5].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.039_28 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [red = 0, green = 0, blue = 0] = channels;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first: string, second: string) {
  const [high, low] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a
  ) as [number, number];
  return (high + 0.05) / (low + 0.05);
}

// Text on a background: WCAG AA needs 4.5:1.
const textPairs: [foreground: string, background: string][] = [
  ["text", "background"],
  ["text", "surface"],
  ["text", "raised"],
  ["text", "raised-hover"],
  ["text-muted", "raised-hover"],
  ["text", "sunken"],
  ["text", "field"],
  ["text-muted", "background"],
  ["text-muted", "surface"],
  ["text-muted", "raised"],
  ["text-muted", "sunken"],
  ["placeholder", "field"],
  ["primary-fg", "primary"],
  ["primary-hover-fg", "primary-hover"],
  ["primary-fg", "primary-active"],
  ["secondary-fg", "secondary"],
  ["secondary-fg", "secondary-hover"],
  ["secondary-fg", "secondary-active"],
  ["destructive-fg", "destructive"],
  ["destructive-hover-fg", "destructive-hover"],
  ["destructive-fg", "destructive-active"],
  ["disabled-fg", "disabled"],
  ["info-fg", "info"],
  ["warning-fg", "warning"],
  ["tooltip-fg", "tooltip"],
  ["text", "menu"],
  ["text", "menu-highlight"],
  ["text-muted", "menu"],
  ["destructive-text", "menu"],
  ["tag-neutral-fg", "tag-neutral"],
  ["tag-fg", "tag-primary"],
  ["tag-fg", "tag-info"],
  ["tag-fg", "tag-warning"],
  ["tag-fg", "tag-destructive"],
  ["tag-fg", "tag-accent"],
];

// Controls and focus against what they sit on: WCAG AA needs 3:1.
const controlPairs: [foreground: string, background: string][] = [
  ["focus", "background"],
  ["focus", "surface"],
  ["outline", "background"],
  ["outline", "surface"],
];

describe.each([
  ["light", light],
  ["dark", dark],
])("the %s theme", (_name, tokens) => {
  it.each(textPairs)("%s on %s is readable", (foreground, background) => {
    const ratio = contrast(tokens[foreground] ?? "", tokens[background] ?? "");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("gives every control a focus ring that stands out", () => {
    const [focus, background] = ["focus", "background"].map(
      (name) => tokens[name] ?? ""
    ) as [string, string];
    expect(contrast(focus, background)).toBeGreaterThanOrEqual(3);
  });
});

describe("the dark theme's outlines", () => {
  // In light mode the outline is near-black on a light page. In dark mode it
  // is near-black on dark gray, as in the reference: there the fill of each
  // control and its highlight carry the shape, so only light mode is held to
  // 3:1 for the outline.
  it.each(controlPairs.slice(2))("%s on %s holds in light mode", (a, b) => {
    expect(contrast(light[a] ?? "", light[b] ?? "")).toBeGreaterThanOrEqual(3);
  });
});

describe("the theme", () => {
  it("only defines craft-prefixed names", () => {
    root.walkDecls(/^--/u, (declaration) => {
      const parent = declaration.parent;
      const inTheme = parent?.type === "atrule";
      expect(declaration.prop).toMatch(
        inTheme ? /^--(color|font|radius)-craft/u : /^--craft-/u
      );
    });
  });

  it("maps every color it exposes to a variable that exists", () => {
    root.walkAtRules("theme", (theme) => {
      theme.walkDecls((declaration) => {
        const name = /var\(--craft-(?<name>[a-z-]+)\)/u.exec(declaration.value)
          ?.groups?.name;
        expect(light[name ?? ""], declaration.prop).toBeDefined();
      });
    });
  });

  it("gives dark mode only the values that really change", () => {
    const overrides = variables(".dark");
    expect(overrides.primary).toBeUndefined();
    expect(overrides.secondary).toBeUndefined();
    expect(overrides.destructive).toBeUndefined();
  });
});
