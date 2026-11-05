import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

// jsdom has no layout, so the browser APIs that measure it need stand-ins. The
// real behavior of positioning and scrolling is covered by the Playwright tests.
globalThis.ResizeObserver ??= class {
  disconnect = () => undefined;
  observe = () => undefined;
  unobserve = () => undefined;
};
Element.prototype.getAnimations ??= () => [];
