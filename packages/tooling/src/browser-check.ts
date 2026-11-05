// Uses the playground of a freshly installed project in a real browser. It runs
// under Node, as Playwright can hang when launched from Bun on Windows.
//
//   node packages/tooling/src/browser-check.ts <url> <screenshot path>

import { chromium, type Page } from "@playwright/test";

const [url, screenshot] = process.argv.slice(2);
if (!(url && screenshot)) {
  throw new Error("Usage: browser-check.ts <url> <screenshot path>");
}

const problems: string[] = [];

function check(condition: unknown, message: string) {
  console.log(`${condition ? "ok  " : "FAIL"} ${message}`);
  if (!condition) {
    problems.push(message);
  }
}

async function runInteractions(tab: Page) {
  const save = tab.getByRole("button", { name: "Save" });
  const face = await save.evaluate(
    (element) => getComputedStyle(element, "::before").backgroundColor
  );
  check(
    face === "rgb(60, 133, 39)",
    `theme and Tailwind utilities apply (button face is ${face})`
  );

  const shadow = await save.evaluate(
    (element) => getComputedStyle(element, "::before").boxShadow
  );
  check(
    shadow.includes("0px -4px 0px 0px inset"),
    "a button inside a panel keeps its thick base"
  );

  const fontLoaded = await tab.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(
      (font) => /jersey/iu.test(font.family) && font.status === "loaded"
    );
  });
  check(fontLoaded, "the documented font setup loads the pixel font");

  const darkMode = tab.getByRole("switch", { name: "Dark mode" });
  await darkMode.click();
  check(
    (await darkMode.getAttribute("aria-checked")) === "false",
    "switch toggles by pointer"
  );
  check(
    !(await tab.evaluate(() =>
      document.documentElement.classList.contains("dark")
    )),
    "the light theme can be selected"
  );
  await darkMode.click();

  const coordinates = tab.getByRole("checkbox", { name: "Show coordinates" });
  await coordinates.click();
  check(
    (await coordinates.getAttribute("aria-checked")) === "false",
    "checkbox toggles"
  );
  check(
    (await page
      .getByRole("checkbox", { name: "Some packs enabled" })
      .getAttribute("aria-checked")) === "mixed",
    "checkbox shows the indeterminate state"
  );

  await tab.getByRole("tab", { name: "General" }).focus();
  await tab.keyboard.press("ArrowRight");
  await tab.keyboard.press("Enter");
  const volume = tab.getByRole("slider", { name: "Volume" });
  await volume.waitFor({ state: "visible" });
  check(await volume.isVisible(), "tabs change by keyboard");

  await volume.focus();
  await tab.keyboard.press("ArrowRight");
  check(
    (await volume.getAttribute("aria-valuenow")) === "61",
    "slider moves by keyboard"
  );

  const trigger = tab.getByRole("button", { name: "Delete world" });
  await trigger.click();
  const dialog = tab.getByRole("dialog", { name: "Delete world?" });
  await dialog.waitFor({ state: "visible" });
  check(await dialog.isVisible(), "dialog opens");
  await tab.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  check(
    await trigger.evaluate((element) => element === document.activeElement),
    "Escape closes the dialog and focus returns to its trigger"
  );

  await tab.getByRole("button", { name: "Help" }).focus();
  const tooltip = tab.getByText("Opens the manual");
  await tooltip.waitFor({ state: "visible" });
  check(await tooltip.isVisible(), "tooltip opens on keyboard focus");
}

const browser = await chromium.launch();
const page = await browser.newPage();
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") {
    errors.push(message.text());
  }
});

await page.goto(url);
await page.waitForLoadState("networkidle");
await runInteractions(page);
check(errors.length === 0, `no browser errors (${errors.join("; ")})`);
await page.screenshot({ fullPage: true, path: screenshot });
await browser.close();

if (problems.length > 0) {
  process.exit(1);
}
