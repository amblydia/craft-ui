import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allPages } from "./pages";

// Ore UI is one design, so every page is checked once, as it always looks.
for (const path of allPages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

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
