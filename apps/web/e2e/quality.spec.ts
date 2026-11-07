import { expect, test } from "@playwright/test";
import { allPages, componentPages } from "./pages";

// Checks every page for what a careful reviewer would: errors in the console,
// hydration mismatches, content that only fits a wide screen, and motion that
// ignores the reduced motion setting.

for (const path of allPages) {
  test(`${path} loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test(`${path} reflows at 320 pixels wide`, async ({ page }) => {
    // WCAG 1.4.10: content fits a 320 CSS pixel window without scrolling
    // sideways. Wide parts, such as tables and code, scroll on their own.
    await page.setViewportSize({ height: 640, width: 320 });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      )
    ).toBeLessThanOrEqual(0);
  });
}

for (const path of componentPages) {
  test(`${path} holds still with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getTiming().iterations ===
              Number.POSITIVE_INFINITY
        )
        .map((animation) =>
          animation instanceof CSSAnimation ? animation.animationName : "script"
        )
    );
    expect(running).toEqual([]);
  });
}
