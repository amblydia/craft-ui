import { existsSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { componentPages, viewPages } from "./pages";

// Screenshot comparisons, so a change to the Ore UI look can't slip through.
// Fonts render differently on each system, so the screenshots are taken on
// Linux, as CI is, by the Visual baselines workflow. Each test is skipped until
// its screenshot has been committed.

test.skip(
  process.platform !== "linux",
  "The screenshots are taken on Linux, as in CI"
);

async function ready(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}

function skipWithoutBaseline(name: string) {
  const info = test.info();
  if (
    info.config.updateSnapshots !== "all" &&
    !existsSync(info.snapshotPath(name))
  ) {
    test.skip(true, `No screenshot yet for ${name}`);
  }
}

test.describe("looks", () => {
  test.use({ viewport: { height: 720, width: 1280 } });

  for (const path of viewPages) {
    const name = `${path.replace("/view/", "block-")}.png`;
    test(`${path} looks the same`, async ({ page }) => {
      skipWithoutBaseline(name);
      await ready(page, path);
      await expect(page).toHaveScreenshot(name);
    });
  }

  for (const path of componentPages.filter((page) =>
    page.startsWith("/docs/components/")
  )) {
    const name = `${path.replace("/docs/components/", "component-")}.png`;
    test(`${path} preview looks the same`, async ({ page }) => {
      skipWithoutBaseline(name);
      await ready(page, path);
      await expect(
        page.locator("div.not-prose.min-h-48").first()
      ).toHaveScreenshot(name);
    });
  }
});
