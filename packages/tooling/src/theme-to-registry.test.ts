import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { prepareRegistry } from "./build-registry";
import { themeSource } from "./paths";
import { themeToRegistry } from "./theme-to-registry";

describe("themeToRegistry", () => {
  it("sorts a stylesheet into cssVars and css", () => {
    const theme = themeToRegistry(`
      :root { --craft-primary: #3c8527; }
      .dark { --craft-text: #fff; }
      @theme inline { --color-craft-primary: var(--craft-primary); }
      @utility craft-focus { outline: 2px solid red; }
      @keyframes spin { from { opacity: 0; } to { opacity: 1; } }
    `);

    expect(theme.cssVars.light).toEqual({ "craft-primary": "#3c8527" });
    expect(theme.cssVars.dark).toEqual({ "craft-text": "#fff" });
    expect(theme.cssVars.theme).toEqual({
      "color-craft-primary": "var(--craft-primary)",
    });
    expect(theme.css).toEqual({
      "@keyframes spin": { from: { opacity: "0" }, to: { opacity: "1" } },
      "@utility craft-focus": { outline: "2px solid red" },
    });
  });

  it("collapses multi-line values", () => {
    const theme = themeToRegistry(
      "@utility a { box-shadow:\n  inset 0 0 red,\n  inset 1px 1px blue; }"
    );
    expect(theme.css["@utility a"]).toEqual({
      "box-shadow": "inset 0 0 red, inset 1px 1px blue",
    });
  });

  it("rejects rules that the registry format can't carry", () => {
    expect(() => themeToRegistry(".button { color: red; }")).toThrow(
      "Unexpected rule"
    );
  });

  it("reads the real theme", () => {
    const theme = themeToRegistry(readFileSync(themeSource, "utf8"));
    expect(theme.cssVars.light["craft-primary"]).toBe("#3c8527");
    expect(theme.cssVars.dark["craft-background"]).toBe("#313233");
    expect(theme.css["@utility craft-bevel"]).toBeDefined();
  });
});

describe("prepareRegistry", () => {
  const registry = prepareRegistry("https://example.com");
  const button = registry.items.find((item) => item.name === "craft-button");

  it("points CraftUI dependencies at absolute URLs", () => {
    expect(button?.registryDependencies).toContain(
      "https://example.com/r/craft-theme.json"
    );
  });

  it("leaves shadcn dependencies as they are", () => {
    expect(button?.registryDependencies).toContain("utils");
  });

  it("fills in the theme item", () => {
    const theme = registry.items.find((item) => item.name === "craft-theme");
    expect(theme).toHaveProperty("cssVars.light.craft-primary", "#3c8527");
  });
});
