import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const path = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/lib/utils", replacement: path("./lib/utils.ts") },
      {
        find: /^@\/components\/craft\/(.+)$/u,
        replacement: `${path("./components")}/$1`,
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["components/**/*.test.tsx", "themes/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
