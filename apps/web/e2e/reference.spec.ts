import { expect, type Page, test } from "@playwright/test";

// Measurements taken from the Ore UI design system images on the wiki, at
// 2 pixels per unit. See docs/design-reference.md.

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

test.describe("matches the Ore UI references", () => {
  test("a checkbox is 13 units square", async ({ page }) => {
    await open(page, "/docs/components/checkbox");
    const box = await page
      .locator('[data-slot="checkbox"]')
      .first()
      .boundingBox();
    expect(box?.width).toBe(26);
    expect(box?.height).toBe(26);
  });

  test("a radio is 14 units from corner to corner", async ({ page }) => {
    await open(page, "/docs/components/radio-group");
    const diamond = page
      .locator('[data-slot="radio"] span[aria-hidden="true"]')
      .first();
    // The bounding box of a square turned 45° spans its diagonal.
    const box = await diamond.boundingBox();
    expect(Math.round(box?.width ?? 0)).toBe(28);
  });

  test("a slider's fill stays inside the track's outline", async ({ page }) => {
    await open(page, "/docs/components/slider");
    const track = page.locator('[data-slot="slider"]').first();
    const fill = track.locator('[class*="bg-craft-primary"]').first();
    const trackBox = await track
      .locator('[class*="craft-bevel"]')
      .first()
      .boundingBox();
    const fillBox = await fill.boundingBox();
    // A 6-unit track, less its outline: 4 units of fill.
    expect(fillBox?.height).toBe(8);
    expect(fillBox?.y ?? 0).toBeGreaterThanOrEqual(trackBox?.y ?? 0);
  });

  test("pressing an unselected tab sinks it, even under the pointer", async ({
    page,
  }) => {
    await open(page, "/docs/components/tabs");
    const tab = page
      .locator('[data-slot="tabs-list"]')
      .first()
      .locator(
        '[data-slot="tabs-trigger"]:not([data-active]):not([data-disabled])'
      )
      .first();
    await tab.hover();
    await page.mouse.down();
    expect(
      await tab.evaluate((el) => getComputedStyle(el).backgroundColor)
    ).toBe("rgb(49, 50, 51)");
    await page.mouse.up();
  });

  test("a tab's focus ring isn't clipped by the tab bar", async ({ page }) => {
    await open(page, "/docs/components/tabs");
    const list = page.locator('[data-slot="tabs-list"]').first();
    const selected = list.locator('[data-slot="tabs-trigger"][data-active]');
    await page.keyboard.press("Shift");
    await selected.focus();
    const tabBox = await selected.boundingBox();
    const listBox = await list.boundingBox();
    // The ring is a unit outside the tab, and the bar leaves a unit of room.
    expect(tabBox?.x ?? 0).toBeGreaterThanOrEqual((listBox?.x ?? 0) + 2);
    expect(
      await selected.evaluate((el) => getComputedStyle(el).outlineOffset)
    ).toBe("0px");
  });

  test("the dialog's close cross is 8 units with one-unit strokes", async ({
    page,
  }) => {
    await open(page, "/docs/components/dialog");
    await page.getByRole("button", { name: "Delete world" }).first().click();
    const icon = page
      .getByRole("dialog")
      .getByRole("button", { name: "Close" })
      .locator("svg");
    // Measured once the dialog has finished scaling in.
    await expect.poll(async () => (await icon.boundingBox())?.width).toBe(16);
    expect(await icon.getAttribute("viewBox")).toBe("0 0 8 8");
  });
});
