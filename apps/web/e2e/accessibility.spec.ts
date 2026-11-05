import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { allPages } from "./pages";

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((value) => {
    localStorage.setItem("theme", value);
  }, theme);
}

for (const theme of ["dark", "light"] as const) {
  test.describe(`${theme} theme`, () => {
    for (const path of allPages) {
      test(`${path} has no accessibility violations`, async ({ page }) => {
        await setTheme(page, theme);
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("html")).toHaveClass(new RegExp(theme, "u"));

        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        expect(
          violations.map((violation) => ({
            id: violation.id,
            nodes: violation.nodes.map((node) => ({
              summary: node.failureSummary,
              target: node.target,
            })),
          }))
        ).toEqual([]);
      });
    }
  });
}
