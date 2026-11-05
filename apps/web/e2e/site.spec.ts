import { expect, test } from "@playwright/test";
import { allPages, componentPages } from "./pages";

test.describe("every page", () => {
  for (const path of allPages) {
    test(`${path} renders without browser errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push(message.text());
        }
      });

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    test(`${path} fits a phone`, async ({ page }) => {
      await page.setViewportSize({ height: 800, width: 360 });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

// A panel is flat, and custom properties inherit, so a control inside one must
// set its own depth or it loses its thick base.
test.describe("inside a panel", () => {
  const raised = {
    button: { pseudo: "::before", selector: '[data-slot="button"]' },
    "slider thumb": {
      pseudo: undefined,
      selector: '[data-slot="slider-thumb"]',
    },
    "switch thumb": {
      pseudo: undefined,
      selector: '[data-slot="switch-thumb"]',
    },
    tab: {
      pseudo: undefined,
      selector: '[data-slot="tabs-trigger"]:not([data-active])',
    },
  };

  for (const [name, { pseudo, selector }] of Object.entries(raised)) {
    test(`a ${name} keeps its thick base`, async ({ page }) => {
      await page.goto("/docs/playground");
      // The slider and the switch are on this tab.
      await page.getByRole("tab", { name: "Audio" }).click();
      const shadow = await page
        .locator(`[data-slot="panel"] ${selector}`)
        .first()
        .evaluate(
          (element, before) => getComputedStyle(element, before).boxShadow,
          pseudo
        );
      expect(shadow).toContain("0px -4px 0px 0px inset");
    });
  }
});

test.describe("component pages", () => {
  for (const path of componentPages) {
    test(`${path} has every required section`, async ({ page }) => {
      await page.goto(path);
      // Each heading also holds its anchor link's hidden label.
      const headings = (
        await page.locator("#nd-page h2").allTextContents()
      ).map((heading) => heading.replace("Copy Anchor Link", "").trim());
      for (const section of [
        "Installation",
        "Usage",
        "Props",
        "Accessibility",
        "Customization",
        "Dependencies",
        "Source",
      ]) {
        expect(headings).toContain(section);
      }
    });

    test(`${path} keeps its props table short`, async ({ page }) => {
      await page.goto(path);
      // The table lists what matters, not every inherited DOM attribute.
      const html = await page.content();
      expect(html).not.toContain("onAuxClick");
      expect(html.length).toBeLessThan(600_000);
    });
  }
});

test("a preview's code tab shows the real source", async ({ page }) => {
  await page.goto("/docs/components/button");
  await page.getByRole("tab", { name: "Code" }).first().click();
  await expect(page.getByText("export function ButtonVariants")).toBeVisible();
});

test("the source section shows the installed component", async ({ page }) => {
  await page.goto("/docs/components/tabs");
  await page.getByRole("button", { name: "components/craft/tabs.tsx" }).click();
  await expect(page.getByText("export function TabsTrigger")).toBeVisible();
});

test("a button presses without moving the layout", async ({ page }) => {
  await page.goto("/docs/components/button");
  const button = page.getByRole("button", { name: "Primary" }).first();
  const before = await button.boundingBox();
  await button.hover();
  await page.mouse.down();
  const during = await button.boundingBox();
  const face = await button.evaluate(
    (element) => getComputedStyle(element, "::before").backgroundColor
  );
  await page.mouse.up();

  expect(during).toEqual(before);
  expect(face).toBe("rgb(42, 100, 28)");
});

test("the focus ring is visible on keyboard focus", async ({ page }) => {
  await page.goto("/docs/components/button");
  const button = page.getByRole("button", { name: "Primary" }).first();
  await button.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  const outline = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.outlineColor, width: style.outlineWidth };
  });
  expect(outline).toEqual({ color: "rgb(255, 255, 255)", width: "2px" });
});

test("the dialog traps focus and closes with Escape", async ({ page }) => {
  await page.goto("/docs/components/dialog");
  const trigger = page.getByRole("button", { name: "Delete world" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Delete world?" });
  await expect(dialog).toBeVisible();

  for (let press = 0; press < 5; press += 1) {
    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        dialog.evaluate((element) => element.contains(document.activeElement))
      )
      .toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the tooltip opens from the keyboard", async ({ page }) => {
  await page.goto("/docs/components/tooltip");
  await page.getByRole("button", { name: "Hover or focus me" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Opens the world settings")).toBeVisible();
});

test("the slider moves with the keyboard", async ({ page }) => {
  await page.goto("/docs/components/slider");
  const slider = page.getByRole("slider", { name: "Music" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "71");
});

test("the form example validates with Zod", async ({ page }) => {
  await page.goto("/docs/components/input");
  await page.getByRole("button", { name: "Create world" }).click();
  await expect(page.getByText("Use at least 3 characters.")).toBeVisible();
  const name = page.locator("form").getByLabel("World name");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("Harbor");
  await page.getByRole("button", { name: "Create world" }).click();
  await expect(page.getByText("Created Harbor.")).toBeVisible();
});

test("the indeterminate progress bar respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/progress");
  const animation = await page
    .locator(
      "[data-indeterminate][style], [data-slot='progress'] [data-indeterminate]"
    )
    .first()
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animation).toBe("none");
});

test("the theme toggle changes the tokens", async ({ page }) => {
  await page.goto("/docs/components/button");
  const background = () =>
    page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue(
        "--craft-background"
      )
    );
  expect((await background()).trim()).toBe("#313233");
  await page.getByRole("button", { name: "Toggle Theme" }).first().click();
  await expect.poll(background).toBe("#e6e8eb");
});

test.describe("registry", () => {
  test("serves items at the paths the shadcn CLI asks for", async ({
    request,
  }) => {
    for (const path of [
      "/r/registry.json",
      "/r/craft-button.json",
      "/r/base-nova/craft-button.json",
      "/r/radix-vega/craft-theme.json",
      "/r/new-york-v4/craft-tabs.json",
    ]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/json");
    }
  });

  test("every style receives the same item", async ({ request }) => {
    const direct = await (await request.get("/r/craft-button.json")).text();
    const styled = await (
      await request.get("/r/base-nova/craft-button.json")
    ).text();
    expect(styled).toBe(direct);
  });

  test("an unknown item is a 404", async ({ request }) => {
    expect((await request.get("/r/base-nova/nope.json")).status()).toBe(404);
  });

  test("a health endpoint is available", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(await response.json()).toEqual({ status: "ok" });
  });
});
