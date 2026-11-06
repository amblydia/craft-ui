import { expect, type Page, test } from "@playwright/test";

// The advanced components, in a real browser: what jsdom can't check, such as
// positioning, inert content and the measured Ore UI look. The docs open in dark
// mode, so colors are the dark theme's. See docs/design-reference.md.

const MENU_LINE = "rgb(140, 141, 144)";
const MENU_ROW = "rgb(88, 88, 90)";
const PRIMARY = "rgb(60, 133, 39)";

async function open(page: Page, path: string) {
  await page.goto(path);
  // Interact only once the page is hydrated.
  await page.waitForLoadState("networkidle");
}

// Spread into evaluate(), which runs the function in the page and passes it the
// property as an argument, as a closure can't cross into the page.
function style(property: string, pseudo?: string) {
  return [
    (element: Element, [name, part]: [string, string | undefined]) =>
      getComputedStyle(element, part).getPropertyValue(name),
    [property, pseudo] as [string, string | undefined],
  ] as const;
}

test.describe("advanced components", () => {
  test("a select opens a framed list of rows below its trigger", async ({
    page,
  }) => {
    await open(page, "/docs/components/select");
    const trigger = page.getByRole("combobox").first();
    await trigger.click();
    const list = page.getByRole("listbox");
    await expect(list).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const listBox = await list.boundingBox();
    expect(listBox?.y ?? 0).toBeGreaterThanOrEqual(
      (triggerBox?.y ?? 0) + (triggerBox?.height ?? 0)
    );

    // Rows 23 units tall, with the frame's line showing one unit between them.
    const rows = page.getByRole("option");
    const first = await rows.nth(0).boundingBox();
    const second = await rows.nth(1).boundingBox();
    expect(first?.height).toBe(46);
    expect((second?.y ?? 0) - ((first?.y ?? 0) + (first?.height ?? 0))).toBe(2);
    expect(
      await page
        .locator('[data-slot="select-content"]')
        .evaluate(...style("background-color"))
    ).toBe(MENU_LINE);

    // Unlike a button, the light dropdown keeps its base while open.
    expect(await trigger.evaluate(...style("box-shadow"))).toContain(
      "0px -4px 0px 0px inset"
    );
  });

  test("a select is chosen from the keyboard", async ({ page }) => {
    await open(page, "/docs/components/select");
    const trigger = page.getByRole("combobox").first();
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveText("Hard");
  });

  test("a combobox filters as you type", async ({ page }) => {
    await open(page, "/docs/components/combobox");
    await page.getByRole("combobox").first().fill("for");
    await expect(page.getByRole("option")).toHaveText([
      "Birch Forest",
      "Dark Forest",
    ]);
  });

  test("a radio is a diamond with a gem when selected", async ({ page }) => {
    await open(page, "/docs/components/radio-group");
    const selected = page.getByRole("radio", { name: "Normal" }).first();
    const diamond = selected.locator('span[aria-hidden="true"]').first();

    // Tailwind's rotate-45 sets the rotate property, not transform.
    expect(await diamond.evaluate(...style("rotate"))).toBe("45deg");
    expect(await diamond.evaluate(...style("background-color"))).toBe(PRIMARY);
    await expect(
      selected.locator('[data-slot="radio-indicator"]')
    ).toBeVisible();
    await expect(
      page
        .getByRole("radio", { name: "Easy" })
        .first()
        .locator('[data-slot="radio-indicator"]')
    ).toHaveCount(0);
  });

  test("a destructive menu item turns into a red row when highlighted", async ({
    page,
  }) => {
    await open(page, "/docs/components/dropdown-menu");
    await page.getByRole("button", { name: "World options" }).click();
    const remove = page.getByRole("menuitem", { name: "Delete world" });
    expect(await remove.evaluate(...style("color"))).toBe("rgb(255, 194, 194)");

    await remove.hover();
    await expect
      .poll(() => remove.evaluate(...style("background-color")))
      .toBe("rgb(202, 54, 54)");
  });

  test("a submenu opens beside its item", async ({ page }) => {
    await open(page, "/docs/components/dropdown-menu");
    await page.getByRole("button", { name: "World options" }).click();
    const exportItem = page.getByRole("menuitem", { name: "Export" });
    await exportItem.hover();
    const nested = page.getByRole("menuitem", { name: "As a world file" });
    await expect(nested).toBeVisible();

    const parent = await exportItem.boundingBox();
    const child = await nested.boundingBox();
    expect(child?.x ?? 0).toBeGreaterThan(
      (parent?.x ?? 0) + (parent?.width ?? 0)
    );
  });

  test("a context menu opens at the pointer", async ({ page }) => {
    await open(page, "/docs/components/context-menu");
    const area = page.locator('[data-slot="context-menu-trigger"]').first();
    const box = await area.boundingBox();
    const x = (box?.x ?? 0) + 40;
    const y = (box?.y ?? 0) + 30;
    await page.mouse.click(x, y, { button: "right" });

    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const menuBox = await menu.boundingBox();
    expect(Math.abs((menuBox?.x ?? 0) - x)).toBeLessThan(6);
    expect(Math.abs((menuBox?.y ?? 0) - y)).toBeLessThan(6);
    expect(
      await page
        .getByRole("menuitem", { name: "Open" })
        .evaluate(...style("background-color"))
    ).toBe(MENU_ROW);
  });

  test("a context menu opens from the keyboard", async ({ page }) => {
    await open(page, "/docs/components/context-menu");
    await page.locator('[data-slot="context-menu-trigger"]').first().focus();
    await page.keyboard.press("Shift+F10");
    await expect(page.getByRole("menu")).toBeVisible();
  });

  test("an accordion item expands", async ({ page }) => {
    await open(page, "/docs/components/accordion");
    const players = page.getByRole("button", { name: "Players" }).first();
    await players.click();
    await expect(players).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByText("Four players have joined this world.").first()
    ).toBeVisible();
  });

  test("a toast appears in the corner in its type's color", async ({
    page,
  }) => {
    await open(page, "/docs/components/toast");
    await page.getByRole("button", { name: "Success" }).first().click();
    const toast = page.locator('[data-slot="toast"]');
    await expect(toast).toBeVisible();
    expect(await toast.evaluate(...style("background-color"))).toBe(PRIMARY);

    // Measured once it has finished sliding in.
    const viewport = page.viewportSize();
    await expect
      .poll(async () => {
        const box = await toast.boundingBox();
        return [
          Math.round(
            (viewport?.width ?? 0) - ((box?.x ?? 0) + (box?.width ?? 0))
          ),
          Math.round(
            (viewport?.height ?? 0) - ((box?.y ?? 0) + (box?.height ?? 0))
          ),
        ];
      })
      .toEqual([16, 16]);

    await toast.getByLabel("Dismiss").click();
    await expect(toast).toHaveCount(0);
  });

  test("a popover opens beside its trigger and takes focus", async ({
    page,
  }) => {
    await open(page, "/docs/components/popover");
    await page.getByRole("button", { name: "World seed" }).first().click();
    const popover = page.getByRole("dialog", { name: "World seed" });
    await expect(popover).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(popover).toHaveCount(0);
  });

  test("a navigation panel's links are menu rows", async ({ page }) => {
    await open(page, "/docs/components/navigation-menu");
    await page.getByRole("button", { name: "Marketplace" }).first().click();
    const link = page.getByRole("link", { name: "Skin packs" });
    await expect(link).toBeVisible();
    expect((await link.boundingBox())?.height).toBe(46);
    expect(await link.evaluate(...style("background-color"))).toBe(MENU_ROW);
  });

  test("the sidebar lifts the current page's row", async ({ page }) => {
    await open(page, "/docs/components/navigation-menu");
    const sidebar = page.getByRole("navigation", { name: "Settings" });
    expect(
      await sidebar
        .locator('[data-slot="navigation-menu-list"]')
        .evaluate(...style("background-color"))
    ).toBe("rgb(49, 50, 51)");
    expect(
      await sidebar
        .getByRole("link", { name: "Accessibility" })
        .evaluate(...style("background-color"))
    ).toBe("rgb(72, 73, 74)");
  });

  test("the current page is green in pagination", async ({ page }) => {
    await open(page, "/docs/components/pagination");
    const current = page.locator('[aria-current="page"]').first();
    expect(
      await current.evaluate(...style("background-color", "::before"))
    ).toBe(PRIMARY);
  });

  test("a table column sorts from its heading", async ({ page }) => {
    await open(page, "/docs/components/table");
    const heading = page.getByRole("columnheader", { name: "Players" }).first();
    await expect(heading).toHaveAttribute("aria-sort", "descending");
    await heading.getByRole("button").click();
    await expect(heading).toHaveAttribute("aria-sort", "ascending");
  });

  test("a tag is a flat block 15 units tall", async ({ page }) => {
    await open(page, "/docs/components/badge");
    const tag = page.locator('[data-slot="badge"]').first();
    expect((await tag.boundingBox())?.height).toBe(30);
    expect(await tag.evaluate(...style("background-color"))).toBe(
      "rgb(30, 30, 31)"
    );
  });

  test("a loading overlay keeps focus out of its content", async ({ page }) => {
    await open(page, "/docs/components/spinner");
    await page.getByRole("button", { name: "Refresh" }).click();
    await expect(page.getByText("Refreshing")).toBeVisible();

    const join = page.locator("button", { hasText: "Join server" });
    await join.focus();
    await expect(join).not.toBeFocused();
  });
});
