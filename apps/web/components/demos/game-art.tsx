import type { Item } from "@/components/craft/item-slot";

// Original pixel art for the examples. Each picture is a grid of characters,
// one per pixel: "." is empty, and other characters take a color from the
// palette.

function Pixels({
  palette,
  rows,
}: {
  palette: Record<string, string>;
  rows: string[];
}) {
  const size = rows[0]?.length ?? 0;
  return (
    <svg
      aria-hidden="true"
      shapeRendering="crispEdges"
      viewBox={`0 0 ${size} ${rows.length}`}
    >
      {/* One path per color, made of one-unit squares. */}
      {Object.entries(palette).map(([key, color]) => (
        <path
          d={rows
            .flatMap((row, y) =>
              [...row].map((pixel, x) =>
                pixel === key ? `M${x} ${y}h1v1h-1z` : ""
              )
            )
            .join("")}
          fill={color}
          key={key}
        />
      ))}
    </svg>
  );
}

const art = {
  apple: {
    palette: { g: "#4f913c", h: "#6b4a2b", r: "#d03a3a", w: "#ff9e9e" },
    rows: [
      "....g...",
      "...hg...",
      ".rrhrr..",
      "rrrrrwr.",
      "rrrrrrr.",
      "rrrrrrr.",
      ".rrrrr..",
      "..r.r...",
    ],
  },
  bread: {
    palette: { b: "#9a6a2f", c: "#d9a55b", l: "#f0cf8a" },
    rows: [
      "........",
      "..bbbb..",
      ".bclccb.",
      "bcclcccb",
      "bccccclb",
      "bbbbbbbb",
      ".bbbbbb.",
      "........",
    ],
  },
  gem: {
    palette: { c: "#4fd1c5", d: "#2c8f87", w: "#d8fffb" },
    rows: [
      "..cccc..",
      ".cwccdc.",
      "cwcccccd",
      ".cccccd.",
      "..cccd..",
      "...cd...",
      "........",
      "........",
    ],
  },
  pickaxe: {
    palette: { d: "#5c5f66", h: "#8a5a2b", s: "#b9bdc4" },
    rows: [
      ".sssss..",
      "s....sd.",
      ".....hs.",
      "....h.s.",
      "...h....",
      "..h.....",
      ".h......",
      "h.......",
    ],
  },
  planks: {
    palette: { d: "#8a5a2b", p: "#b5823f" },
    rows: [
      "pppppppp",
      "dddddddd",
      "pppdpppp",
      "dddddddd",
      "ppppppdp",
      "dddddddd",
      "pdpppppp",
      "dddddddd",
    ],
  },
  potion: {
    palette: { b: "#9fb4c7", c: "#6b4a2b", p: "#b04fd1", w: "#f0d9ff" },
    rows: [
      "...cc...",
      "...bb...",
      "..b..b..",
      ".bppppb.",
      ".bpwppb.",
      ".bppppb.",
      "..bbbb..",
      "........",
    ],
  },
  stone: {
    palette: { d: "#6e7178", l: "#a3a6ad", s: "#8a8d94" },
    rows: [
      "ssslssss",
      "sdssssls",
      "sssssdss",
      "lsssssss",
      "ssdsslss",
      "ssssssds",
      "slsdssss",
      "ssssslss",
    ],
  },
  sword: {
    palette: { d: "#7d8189", g: "#d9a521", h: "#6b4a2b", s: "#dfe3ea" },
    rows: [
      "......sd",
      ".....sd.",
      "....sd..",
      ".g.sd...",
      "..gd....",
      "..hg....",
      ".h..g...",
      "h.......",
    ],
  },
  torch: {
    palette: { h: "#8a5a2b", o: "#f08a24", y: "#ffe866" },
    rows: [
      "...yy...",
      "...oy...",
      "...oo...",
      "...hh...",
      "...hh...",
      "...hh...",
      "...hh...",
      "...hh...",
    ],
  },
};

export type ArtName = keyof typeof art;

export function GameArt({ name }: { name: ArtName }) {
  return <Pixels {...art[name]} />;
}

export const items = {
  apple: {
    count: 5,
    icon: <GameArt name="apple" />,
    id: "apple",
    name: "Apple",
  },
  bread: {
    count: 12,
    description: "Restores a little hunger.",
    icon: <GameArt name="bread" />,
    id: "bread",
    name: "Bread",
  },
  gem: { count: 3, icon: <GameArt name="gem" />, id: "gem", name: "Sea Gem" },
  pickaxe: {
    description: "Breaks stone and ore.",
    durability: 0.42,
    icon: <GameArt name="pickaxe" />,
    id: "pickaxe",
    name: "Iron Pickaxe",
  },
  planks: {
    count: 64,
    icon: <GameArt name="planks" />,
    id: "planks",
    name: "Oak Planks",
  },
  potion: {
    description: "Glows for eight minutes.",
    icon: <GameArt name="potion" />,
    id: "potion",
    name: "Glow Potion",
  },
  stone: {
    count: 48,
    icon: <GameArt name="stone" />,
    id: "stone",
    name: "Stone",
  },
  sword: {
    description: "Sharp, and nearly new.",
    durability: 0.9,
    icon: <GameArt name="sword" />,
    id: "sword",
    name: "Iron Sword",
  },
  torch: {
    count: 24,
    icon: <GameArt name="torch" />,
    id: "torch",
    name: "Torch",
  },
} satisfies Record<string, Item>;

const scenes = {
  desert: {
    ground: "#d9c27a",
    hills: "#c9a95b",
    sky: "#9cc8ff",
    sun: "#fff2a8",
  },
  meadow: {
    ground: "#6b4a2b",
    hills: "#4f913c",
    sky: "#8cb3ff",
    sun: "#ffe866",
  },
  night: {
    ground: "#3b3f4a",
    hills: "#2a5d3a",
    sky: "#1f2a4d",
    sun: "#e6e8eb",
  },
  snow: { ground: "#8c8d90", hills: "#f4f6f9", sky: "#b9d3ff", sun: "#ffffff" },
};

export type SceneName = keyof typeof scenes;

// Stepped hills, the same every time for a scene.
const HILLS = [
  7, 7, 6, 6, 5, 5, 5, 6, 7, 7, 8, 8, 7, 6, 6, 5, 4, 4, 5, 6, 7, 8, 8, 9, 9, 8,
  7, 7, 6, 6, 7, 7,
];

/** A small landscape, for world pictures. */
export function Scene({ name }: { name: SceneName }) {
  const colors = scenes[name];
  return (
    <svg
      aria-hidden="true"
      className="size-full"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      viewBox="0 0 32 18"
    >
      <rect fill={colors.sky} height="18" width="32" />
      <rect fill={colors.sun} height="3" width="3" x="24" y="2" />
      <path
        d={HILLS.map(
          (height, x) => `M${x} ${18 - height}h1v${height}h-1z`
        ).join("")}
        fill={colors.hills}
      />
      <path
        d={HILLS.map(
          (height, x) => `M${x} ${20 - height}h1v${Math.max(0, height - 2)}h-1z`
        ).join("")}
        fill={colors.ground}
      />
    </svg>
  );
}

// An original blocky explorer: copper hair, a rust jacket and gray trousers.
const explorer = {
  palette: {
    b: "#3b2a1e",
    c: "#c8663a",
    e: "#2b3a4a",
    g: "#5b6270",
    h: "#b5532a",
    j: "#8f3d22",
    k: "#d9a07a",
    s: "#2a2d33",
  },
  rows: [
    "..hhhh..",
    ".hhhhhh.",
    ".hkkkkh.",
    ".kekkek.",
    ".kkkkkk.",
    "..kbbk..",
    ".jjccjj.",
    "jjjccjjj",
    "jjjccjjj",
    "kjjccjjk",
    "kjjjjjjk",
    "..gggg..",
    "..gggg..",
    "..g..g..",
    "..g..g..",
    ".ss..ss.",
  ],
};

/** A full-length character for profile and menu previews. */
export function Explorer() {
  return (
    <span className="block aspect-[1/2] h-full max-h-80 [&>svg]:size-full">
      <Pixels {...explorer} />
    </span>
  );
}
