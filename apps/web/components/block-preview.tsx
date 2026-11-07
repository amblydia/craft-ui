import type { ReactNode } from "react";

/**
 * The frame around a live block. It's tall and full width, and the block
 * fills it, so a screen shows its bar, content and background as it would in
 * an app. A link opens the block on a page of its own.
 */
export function BlockPreview({
  children,
  view,
}: {
  children: ReactNode;
  /** The block's name, for its full page at /view/{name}. */
  view?: string;
}) {
  return (
    <div className="not-prose flex flex-col gap-2">
      <div className="border-craft-outline h-[44rem] max-h-[85dvh] overflow-hidden border-2 *:h-full">
        {children}
      </div>
      {view ? (
        <a
          className="text-fd-muted-foreground hover:text-fd-foreground self-end text-sm underline"
          href={`/view/${view}`}
          rel="noopener"
          target="_blank"
        >
          Open on a page of its own
        </a>
      ) : null}
    </div>
  );
}
