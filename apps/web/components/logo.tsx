import type { ComponentProps } from "react";

/** The CraftUI mark: a beveled green block with a pixel C. */
export function Logo(props: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      shapeRendering="crispEdges"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M0 0h16v16H0z" fill="#1e1e1f" />
      <path d="M1 1h14v14H1z" fill="#3c8527" />
      <path d="M1 1h14v1H2v11H1z" fill="#639d52" />
      <path d="M1 13h14v2H1z" fill="#1d4d13" />
      <path d="M5 4h6v2H6v4h5v2H5V11H4V5h1z" fill="#fff" />
    </svg>
  );
}
