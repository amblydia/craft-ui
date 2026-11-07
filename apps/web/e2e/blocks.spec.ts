import { expect, type Page, test } from "@playwright/test";
import { viewPages } from "./pages";

// The blocks, each on a page of its own as it would be in an app.

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

test.describe("blocks", () => {
  for (const path of viewPages) {
    test(`${path} fills a phone screen without scrolling sideways`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: 800, width: 390 });
      await open(page, path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        )
      ).toBe(true);
    });
  }

  test("the screen bar matches Ore UI's light bar", async ({ page }) => {
    await open(page, "/view/server-browser");
    const header = page.locator('[data-slot="screen-header"]');
    expect(
      await header.evaluate((el) => getComputedStyle(el).backgroundColor)
    ).toBe("rgb(230, 232, 235)");
    await expect(
      page.getByRole("heading", { level: 1, name: "Play" })
    ).toBeVisible();
  });

  test("the main menu puts Play first, and the character beside it", async ({
    page,
  }) => {
    await open(page, "/view/main-menu");
    const menu = page.getByRole("navigation", { name: "Main menu" });
    await expect(menu.getByRole("button").first()).toHaveText("Play");
    const character = await page
      .locator('[data-slot="main-menu-character"]')
      .boundingBox();
    const buttons = await menu.boundingBox();
    expect(character?.x ?? 0).toBeGreaterThan(
      (buttons?.x ?? 0) + (buttons?.width ?? 0)
    );
  });

  test("a narrow main menu leaves the character out", async ({ page }) => {
    await page.setViewportSize({ height: 800, width: 390 });
    await open(page, "/view/main-menu");
    await expect(
      page.locator('[data-slot="main-menu-character"]')
    ).toBeHidden();
  });

  test("the server browser shows the chosen server beside the list", async ({
    page,
  }) => {
    await open(page, "/view/server-browser");
    await page
      .getByRole("button", { exact: true, name: "Builders Bay" })
      .click();
    const details = page.getByRole("region", { name: "Builders Bay details" });
    await expect(details).toBeVisible();
    const list = await page
      .getByRole("list", { name: "Servers" })
      .boundingBox();
    const panel = await details.boundingBox();
    expect(panel?.x ?? 0).toBeGreaterThan((list?.x ?? 0) + (list?.width ?? 0));
    await page.getByRole("switch", { name: "Favorites only" }).click();
    await expect(
      page.getByRole("list", { name: "Servers" }).getByRole("listitem")
    ).toHaveCount(1);
  });

  test("the settings screen changes and resets a setting", async ({ page }) => {
    await open(page, "/view/settings-screen");
    const speech = page.getByRole("switch", { name: "Text to speech" });
    await expect(speech).toBeChecked();
    await speech.click();
    await expect(speech).not.toBeChecked();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(speech).toBeChecked();
  });

  test("the inventory moves an item from the hotbar to the backpack", async ({
    page,
  }) => {
    await open(page, "/view/inventory-screen");
    await page.getByRole("button", { name: "Move to backpack" }).click();
    await expect(
      page
        .getByRole("grid", { name: "Backpack" })
        .getByRole("gridcell", { name: "Iron Sword, 90% durability" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Move to hotbar" })
    ).toBeVisible();
  });

  test("the confirmation dialog waits for the box", async ({ page }) => {
    await open(page, "/view/confirmation-dialog");
    await page.getByRole("button", { name: "Delete Riverside" }).click();
    const dialog = page.getByRole("alertdialog", {
      name: 'Delete "Riverside"?',
    });
    const confirm = dialog.getByRole("button", { name: "Delete world" });
    await expect(confirm).toBeDisabled();
    await dialog.getByText("I understand this can't be undone").click();
    await confirm.click();
    await expect(page.getByText("Riverside was deleted.")).toBeVisible();
  });

  test("the lobby sends a chat message", async ({ page }) => {
    await open(page, "/view/multiplayer-lobby");
    await page.getByRole("textbox", { name: "Message" }).fill("On my way");
    await page.keyboard.press("Enter");
    await expect(page.getByText("On my way")).toBeVisible();
    await page.getByRole("button", { name: "Ready" }).click();
    await expect(page.getByRole("button", { name: "Start" })).toBeEnabled();
  });

  test("the marketplace pages its results", async ({ page }) => {
    await open(page, "/view/marketplace");
    await page.getByRole("link", { name: "2" }).click();
    await expect(
      page.getByRole("button", { name: "Lantern Town" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("a block's docs page links to its own page", async ({ page }) => {
    await open(page, "/docs/blocks/main-menu");
    await expect(
      page.getByRole("link", { name: "Open on a page of its own" })
    ).toHaveAttribute("href", "/view/main-menu");
  });
});
