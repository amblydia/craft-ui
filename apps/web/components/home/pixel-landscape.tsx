// An original pixel landscape, drawn from a little math at build time. It gives
// the hero the depth that a panorama gives a game menu, using no game art. It's
// one <svg> of a few hundred rectangles, so it costs no client JavaScript.

const COLUMNS = 96;
const ROWS = 40;

const sky = ["#2d6da3", "#3a7eb5", "#4a8fc4", "#5da0d0", "#74b1da", "#8cc0e2"];
const farHills = "#5f8f9f";
const grass = "#4f913c";
const grassLight = "#639d52";
const dirt = "#6b4a2f";
const stone = "#6d6d6e";

function height(column: number, scale: number, offset: number) {
  return (
    Math.sin(column * scale + offset) * 4 +
    Math.sin(column * scale * 2.7 + offset * 2) * 2 +
    Math.sin(column * scale * 0.4 + offset * 3) * 3
  );
}

function blocks() {
  const rects: {
    color: string;
    h: number;
    key: string;
    x: number;
    y: number;
  }[] = [];
  for (let column = 0; column < COLUMNS; column += 1) {
    const near = Math.round(30 + height(column, 0.16, 4.1) * 0.8);
    // The far hills stay behind the near ones.
    const far = Math.min(Math.round(19 + height(column, 0.11, 1.2)), near);
    const add = (color: string, y: number, h: number) =>
      rects.push({ color, h, key: `${column}-${y}`, x: column, y });

    add(farHills, far, near - far);
    add(column % 5 === 0 ? grassLight : grass, near, 1);
    add(dirt, near + 1, 4);
    add(stone, near + 5, Math.max(ROWS - near - 5, 0));
  }
  return rects;
}

export function PixelLandscape({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      viewBox={`0 0 ${COLUMNS} ${ROWS}`}
    >
      {sky.map((color, index) => (
        <rect
          fill={color}
          height={ROWS}
          key={color}
          width={COLUMNS}
          y={index * 4}
        />
      ))}
      {blocks().map((block) => (
        <rect
          fill={block.color}
          height={block.h}
          key={block.key}
          width={1}
          x={block.x}
          y={block.y}
        />
      ))}
    </svg>
  );
}
