import { expect, type Page, test } from "@playwright/test";

// The game components, in a real browser: what jsdom can't check, such as drag
// and drop, page-wide keys, tooltips that follow focus and layouts that wrap.

const PRIMARY = "rgb(60, 133, 39)";

async function open(page: Page, path: string) {
  await page.goto(path);
  // Interact only once the page is hydrated.
  await page.waitForLoadState("networkidle");
}

test.describe("game components", () => {
  test("a slot is 24 units square, with a green frame when selected", async ({
    page,
  }) => {
    await open(page, "/docs/components/item-slot");
    const slots = page.locator('[data-slot="item-slot"]');
    const box = await slots.first().boundingBox();
    expect(box?.width).toBe(48);
    expect(box?.height).toBe(48);
    expect(
      await page
        .locator('[data-slot="item-slot"][data-selected]')
        .first()
        .evaluate((slot) => getComputedStyle(slot).boxShadow)
    ).toContain(PRIMARY);
  });

  test("an inventory is one tab stop, and its tooltip follows the focus", async ({
    page,
  }) => {
    await open(page, "/docs/components/inventory-grid");
    const grid = page.getByRole("grid", { name: "Backpack" });
    await grid
      .getByRole("gridcell", { name: "Iron Sword, 90% durability" })
      .click();
    await page.keyboard.press("ArrowRight");
    const pickaxe = grid.getByRole("gridcell", {
      name: "Iron Pickaxe, 42% durability",
    });
    await expect(pickaxe).toBeFocused();
    await expect(page.getByText("Breaks stone and ore.")).toBeVisible();

    // The tooltip sits above the focused slot.
    const tip = await page.getByText("Breaks stone and ore.").boundingBox();
    const slot = await pickaxe.boundingBox();
    expect(tip?.y ?? 0).toBeLessThan(slot?.y ?? 0);

    await page.keyboard.press("Enter");
    await expect(pickaxe).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Selected: Iron Pickaxe")).toBeVisible();
  });

  test("an item moves when dragged to another slot", async ({ page }) => {
    await open(page, "/docs/components/inventory-grid");
    const grid = page.getByRole("grid", { name: "Backpack" });
    const cells = grid.getByRole("gridcell");
    await cells.nth(3).dragTo(cells.nth(2));
    await expect(cells.nth(2)).toHaveAccessibleName("Bread, 12");
    await expect(cells.nth(3)).toHaveAccessibleName("Empty slot");
  });

  test("an item moves with Alt and an arrow key", async ({ page }) => {
    await open(page, "/docs/components/inventory-grid");
    const cells = page
      .getByRole("grid", { name: "Backpack" })
      .getByRole("gridcell");
    await cells.nth(3).click();
    await page.keyboard.press("Alt+ArrowLeft");
    await expect(cells.nth(2)).toHaveAccessibleName("Bread, 12");
    await expect(cells.nth(2)).toBeFocused();
  });

  test("the number keys pick a hotbar slot from anywhere on the page", async ({
    page,
  }) => {
    await open(page, "/docs/components/hotbar");
    const bars = page.getByRole("listbox", { name: "Hotbar" });
    // The second example listens to the whole page.
    const withHotkeys = bars.nth(1);
    await page.locator("body").click({ position: { x: 5, y: 300 } });
    await page.keyboard.press("3");
    await expect(
      withHotkeys.getByRole("option", { name: "Torch, 24" })
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Holding: Torch")).toBeVisible();
    // The first example only listens while it has focus.
    await expect(
      bars.first().getByRole("option", { name: "Iron Sword, 90% durability" })
    ).toHaveAttribute("aria-selected", "true");
  });

  test("a hotbar shows the selected item's name", async ({ page }) => {
    await open(page, "/docs/components/hotbar");
    const bar = page.getByRole("listbox", { name: "Hotbar" }).first();
    await bar.getByRole("option").first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('[data-slot="hotbar-name"]').first()).toHaveText(
      "Iron Pickaxe"
    );
  });

  test("servers join and favorite, but not while offline", async ({ page }) => {
    await open(page, "/docs/components/server-list");
    await page.getByRole("button", { name: "Join Gemfall" }).click();
    await expect(page.getByText("Joining Gemfall…")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Join The Quarry" })
    ).toBeDisabled();

    const star = page.getByRole("button", { name: "Favorite Builders Bay" });
    await expect(star).toHaveAttribute("aria-pressed", "false");
    await star.click();
    await expect(star).toHaveAttribute("aria-pressed", "true");
  });

  test("a world is deleted only after confirming", async ({ page }) => {
    await open(page, "/docs/components/world-list");
    const worlds = page.getByRole("list", { name: "Worlds" });
    await page.getByRole("button", { name: "Delete Riverside" }).click();
    const dialog = page.getByRole("alertdialog", {
      name: 'Delete "Riverside"?',
    });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      worlds.getByRole("button", { name: "Play Riverside" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Delete Riverside" }).click();
    await dialog.getByRole("button", { name: "Delete" }).click();
    await expect(
      worlds.getByRole("button", { name: "Play Riverside" })
    ).toHaveCount(0);
  });

  test("worlds can be searched", async ({ page }) => {
    await open(page, "/docs/components/world-list");
    await page.getByRole("searchbox", { name: "Search worlds" }).fill("frost");
    await expect(
      page.getByRole("list", { name: "Worlds" }).getByRole("listitem")
    ).toHaveCount(1);
  });

  test("settings change category with the arrow keys", async ({ page }) => {
    await open(page, "/docs/components/settings-menu");
    await page.getByRole("tab", { name: "Accessibility" }).click();
    await page.keyboard.press("ArrowDown");
    await expect(
      page.getByRole("tab", { name: "Keyboard & Mouse" })
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("switch", { name: "Invert Y axis" })
    ).toBeVisible();
  });

  test("a setting's switch stays beside its label on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 800, width: 390 });
    await open(page, "/docs/components/settings-menu");
    const control = page.getByRole("switch", { name: "Closed captions" });
    const label = page.getByText("Closed captions", { exact: true });
    const controlBox = await control.boundingBox();
    const labelBox = await label.boundingBox();
    expect(controlBox?.x ?? 0).toBeGreaterThan(
      (labelBox?.x ?? 0) + (labelBox?.width ?? 0)
    );
    // Nothing on the page scrolls sideways.
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  });

  test("the settings sidebar wraps above the settings in a narrow space", async ({
    page,
  }) => {
    await open(page, "/docs/components/settings-menu");
    const nav = await page
      .getByRole("tablist", { name: "Settings" })
      .boundingBox();
    const panel = await page
      .locator('[data-slot="settings-panel"]')
      .first()
      .boundingBox();
    // The docs column is too narrow for both side by side.
    expect(panel?.y ?? 0).toBeGreaterThan((nav?.y ?? 0) + (nav?.height ?? 0));

    // With room, they sit side by side.
    await page.evaluate(() => {
      const menu = document.querySelector<HTMLElement>(
        '[data-slot="settings-menu"]'
      );
      if (menu) {
        // Its flex parent would shrink a plain width.
        menu.style.minWidth = "900px";
        menu.style.maxWidth = "none";
      }
    });
    const wideNav = await page
      .getByRole("tablist", { name: "Settings" })
      .boundingBox();
    const widePanel = await page
      .locator('[data-slot="settings-panel"]')
      .first()
      .boundingBox();
    expect(widePanel?.y).toBe(wideNav?.y);
    // The settings take all but a sliver of the free space, so the sidebar
    // keeps its 18rem.
    expect(Math.abs((wideNav?.width ?? 0) - 288)).toBeLessThan(2);
  });

  test("profile statistics leave no empty cells", async ({ page }) => {
    await open(page, "/docs/components/profile-panel");
    const stats = page.locator('[data-slot="profile-stat"]');
    const first = await stats.nth(0).boundingBox();
    const second = await stats.nth(1).boundingBox();
    const container = await page
      .locator('[data-slot="profile-stats"]')
      .boundingBox();
    // Two tiles fill the first row between them.
    expect(Math.round((second?.x ?? 0) + (second?.width ?? 0))).toBe(
      Math.round((container?.x ?? 0) + (container?.width ?? 0))
    );
    expect(first?.y).toBe(second?.y);
  });
});
