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

// Values measured from the Ore UI references. See docs/design-reference.md.
test.describe("against the Ore UI reference", () => {
  test("the theme loads Departure Mono", async ({ page }) => {
    await page.goto("/docs/components/button");
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some(
        (font) => font.family.includes("Departure") && font.status === "loaded"
      );
    });
    expect(loaded).toBe(true);
    for (const file of ["departure-mono.css", "DepartureMono-Regular.woff2"]) {
      const response = await page.request.get(`/fonts/${file}`);
      expect(response.ok()).toBe(true);
      expect(response.headers()["access-control-allow-origin"]).toBe("*");
    }
  });

  test("a selected tab sinks below its neighbours", async ({ page }) => {
    await page.goto("/docs/components/tabs");
    const selected = await page
      .locator('[data-slot="tabs-trigger"][data-active]')
      .first()
      .boundingBox();
    const other = await page
      .locator('[data-slot="tabs-trigger"]:not([data-active])')
      .first()
      .boundingBox();
    expect((selected?.y ?? 0) - (other?.y ?? 0)).toBe(4);
    expect((selected?.y ?? 0) + (selected?.height ?? 0)).toBe(
      (other?.y ?? 0) + (other?.height ?? 0)
    );
  });

  test("a disabled tab keeps the colors of a normal tab", async ({ page }) => {
    await page.goto("/docs/components/tabs");
    const faces = await page
      .locator('[data-slot="tabs-list"]')
      .first()
      .locator('[data-slot="tabs-trigger"]:not([data-active])')
      .evaluateAll((tabs) =>
        tabs.map((tab) => getComputedStyle(tab).backgroundColor)
      );
    expect(new Set(faces).size).toBe(1);
  });

  test("a disabled input is a light field", async ({ page }) => {
    await page.goto("/docs/components/input");
    const face = await page
      .locator('[data-slot="input"]:has(:disabled)')
      .first()
      .evaluate((field) => getComputedStyle(field).backgroundColor);
    expect(face).toBe("rgb(208, 209, 212)");
  });

  test("the switch's focus ring wraps only its thumb", async ({ page }) => {
    await page.goto("/docs/components/switch");
    const control = page.locator('[data-slot="switch"]').first();
    await page.getByRole("switch").first().focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const thumb = control.locator('[data-slot="switch-thumb"]');
    expect(
      await thumb.evaluate((element) => getComputedStyle(element).outlineStyle)
    ).toBe("solid");
    expect(
      await control.evaluate(
        (element) => getComputedStyle(element).outlineStyle
      )
    ).toBe("none");
  });

  test("a slider can mark its steps", async ({ page }) => {
    await page.goto("/docs/components/slider");
    await expect(page.locator('[data-slot="slider-notch"]')).toHaveCount(13);
  });

  test("a progress bar is 2 units tall by default", async ({ page }) => {
    await page.goto("/docs/components/progress");
    const height = await page
      .locator('[data-slot="progress-track"]')
      .first()
      .evaluate((element) => element.getBoundingClientRect().height);
    expect(height).toBe(4);
  });

  test("a default panel is a row without an outline", async ({ page }) => {
    await page.goto("/docs/components/panel");
    const border = await page
      .locator('[data-slot="panel"]', { hasText: "A panel with the surface" })
      .first()
      .evaluate((panel) => getComputedStyle(panel).borderTopWidth);
    expect(border).toBe("0px");
  });

  test("a dialog's actions share the footer evenly", async ({ page }) => {
    await page.setViewportSize({ height: 800, width: 1100 });
    await page.goto("/docs/components/dialog");
    await page.getByRole("button", { name: "Delete world" }).first().click();
    const footer = page.locator('[data-slot="dialog-footer"]');
    await expect(footer).toBeVisible();
    expect(
      await footer.evaluate(
        (element) => getComputedStyle(element).borderTopWidth
      )
    ).toBe("0px");
    const widths = await footer
      .locator("button")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().width)
      );
    expect(widths).toHaveLength(2);
    expect(Math.abs((widths[0] ?? 0) - (widths[1] ?? 0))).toBeLessThanOrEqual(
      1
    );
  });

  test("a tooltip has stepped corners", async ({ page }) => {
    await page.goto("/docs/components/tooltip", { waitUntil: "networkidle" });
    await page.locator('[data-slot="tooltip-trigger"]').first().hover();
    const clip = await page
      .locator('[data-slot="tooltip-content"]')
      .evaluate((tip) => getComputedStyle(tip, "::before").clipPath);
    expect(clip).toContain("polygon");
  });

  test("a scrollbar doesn't cover the content", async ({ page }) => {
    await page.goto("/docs/components/scroll-area", {
      waitUntil: "networkidle",
    });
    const area = page.locator('[data-slot="scroll-area"]').first();
    await expect(area.locator("[data-has-overflow-y]").first()).toHaveCSS(
      "padding-inline-end",
      "18px"
    );
    const bar = await area
      .locator('[data-slot="scroll-area-scrollbar"]')
      .boundingBox();
    expect(bar?.width).toBe(18);
  });

  test("a scroll area has no frame", async ({ page }) => {
    await page.goto("/docs/components/scroll-area");
    const border = await page
      .locator('[data-slot="scroll-area"]')
      .first()
      .evaluate((area) => getComputedStyle(area).borderTopWidth);
    expect(border).toBe("0px");
  });
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
