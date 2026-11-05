import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 1 : 0,
  testDir: "./e2e",
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    // The built site, as it runs in production. Run `bun run build` first.
    command: `bun run next start -p ${port}`,
    reuseExistingServer: !process.env.CI,
    url: `http://localhost:${port}/api/health`,
  },
});
