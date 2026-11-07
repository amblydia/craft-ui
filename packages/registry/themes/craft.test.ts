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

// Ore UI is one design: every value lives on :root, with no dark variant.
const tokens = variables(":root");

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
  ["primary-fg", "primary-active"],
  ["secondary-fg", "secondary"],
  ["secondary-fg", "secondary-hover"],
  ["secondary-fg", "secondary-active"],
  ["destructive-fg", "destructive"],
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
  ["text", "slot"],
  ["header-fg", "header"],
  ["text-muted", "slot"],
];

// Controls against what they sit on: WCAG AA needs 3:1.
const controlPairs: [foreground: string, background: string][] = [
  ["focus", "background"],
  ["focus", "surface"],
  ["signal-good", "surface"],
  ["signal-fair", "surface"],
  ["signal-poor", "surface"],
  ["favorite", "surface"],
];

describe("contrast", () => {
  it.each(textPairs)("%s on %s is readable", (foreground, background) => {
    const ratio = contrast(tokens[foreground] ?? "", tokens[background] ?? "");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it.each(controlPairs)("%s on %s stands out", (foreground, background) => {
    const ratio = contrast(tokens[foreground] ?? "", tokens[background] ?? "");
    expect(ratio).toBeGreaterThanOrEqual(3);
  });
});

describe("hover labels follow the reference", () => {
  // As in Ore UI, the labels stay white on the brighter hover fills: 3.1:1 on
  // green and 2.4:1 on red. They only show under the pointer, and keyboard
  // focus keeps the normal fills, which pass. These hold the measured values,
  // so a change to either color is a deliberate one.
  it.each([
    ["primary-hover-fg", "primary-hover", 3.09],
    ["destructive-hover-fg", "destructive-hover", 2.43],
  ])("%s on %s is %f:1", (foreground, background, expected) => {
    const ratio = contrast(tokens[foreground] ?? "", tokens[background] ?? "");
    expect(ratio).toBeCloseTo(expected, 2);
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
        expect(tokens[name ?? ""], declaration.prop).toBeDefined();
      });
    });
  });

  it("has no light or dark variant", () => {
    const rules: string[] = [];
    // Top-level rules only: keyframe steps such as `from` are inside at-rules.
    for (const node of root.nodes) {
      if (node.type === "rule") {
        rules.push(node.selector);
      }
    }
    expect(rules).toEqual([":root"]);
  });
});
