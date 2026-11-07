"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { Badge } from "@/components/craft/badge";
import { Input } from "@/components/craft/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/craft/pagination";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";
import { cn } from "@/lib/utils";

export interface Product {
  /** Its category, matched against `categories`. */
  category?: string;
  /** Who made it. */
  creator: string;
  id: string;
  /** Shows an Owned tag in place of the price. */
  owned?: boolean;
  /** The price, in your store's currency. */
  price: number;
  /** The average rating, out of 5. */
  rating?: number;
  /** A wide picture, usually an `<img>` with an empty `alt`. */
  thumbnail?: ReactNode;
  title: string;
}

type Sort = "featured" | "price-low" | "price-high" | "rating";

const sorts: { label: string; value: Sort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" },
  { label: "Rating", value: "rating" },
];

const numbers = new Intl.NumberFormat();

function CoinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      shapeRendering="crispEdges"
      viewBox="0 0 10 10"
    >
      <path d="M3 0h4v1h2v2h1v4H9v2H7v1H3V9H1V7H0V3h1V1h2z" fill="#9a6a00" />
      <path d="M3 1h4v1h1v1h1v4H8v1H7v1H3V8H2V7H1V3h1V2h1z" fill="#f2c230" />
      <path d="M3 2h2v1H4v1H3zM4 3h1v4H4z" fill="#ffe680" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M5 0h2v3h5v2h-1v1h-1v1H9v2h1v3H9v-1H8v-1H7V9H5v1H4v1H3v1H2V9h1V7H2V6H1V5H0V3h5z" />
    </svg>
  );
}

export interface MarketplaceProps
  extends Omit<ComponentProps<"div">, "children" | "onSelect" | "title"> {
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** The categories to filter by. Without them, there is no category filter. */
  categories?: { label: string; value: string }[];
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** Called with a product when its card is pressed. */
  onSelect: (product: Product) => void;
  /** How many cards on a page. */
  pageSize?: number;
  /** Everything for sale. */
  products: Product[];
  /** The screen's name, in the bar along the top. */
  title?: string;
}

/**
 * A store page in the style of Ore UI's marketplace: cards with a picture,
 * creator, rating and price, with search, a category filter, sorting and
 * pages.
 */
export function Marketplace({
  background,
  categories,
  className,
  onBack,
  onSelect,
  pageSize = 8,
  products,
  title = "Marketplace",
  ...props
}: MarketplaceProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(0);

  const filtered = products
    .filter(
      (product) =>
        (category === "all" || product.category === category) &&
        `${product.title} ${product.creator}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-low") {
        return a.price - b.price;
      }
      if (sort === "price-high") {
        return b.price - a.price;
      }
      if (sort === "rating") {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      return 0;
    });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const shown = filtered.slice(current * pageSize, (current + 1) * pageSize);
  const allCategories = categories
    ? [{ label: "All categories", value: "all" }, ...categories]
    : [];

  const goTo = (next: number) => (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setPage(next);
  };

  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="marketplace"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            aria-label="Search the marketplace"
            className="min-w-48 flex-1"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Search"
            type="search"
            value={query}
          />
          {categories ? (
            <Select
              items={allCategories}
              onValueChange={(value) => {
                setCategory(String(value));
                setPage(0);
              }}
              value={category}
            >
              <SelectTrigger
                aria-label="Category"
                className="w-64"
                variant="sunken"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Select
            items={sorts}
            onValueChange={(value) => setSort(value as Sort)}
            value={sort}
          >
            <SelectTrigger
              aria-label="Sort by"
              className="w-64"
              variant="sunken"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sorts.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ScreenSection title={`Results (${filtered.length})`}>
          {shown.length > 0 ? (
            <ul
              aria-label="Products"
              className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4"
            >
              {shown.map((product) => (
                <ProductCard
                  key={product.id}
                  onSelect={() => onSelect(product)}
                  product={product}
                />
              ))}
            </ul>
          ) : (
            <p className="bg-craft-overlay font-craft-body p-(--craft-space) text-sm">
              Nothing matches your search.
            </p>
          )}
        </ScreenSection>
        {pages > 1 ? (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={current === 0}
                  href="#previous"
                  onClick={goTo(current - 1)}
                />
              </PaginationItem>
              {Array.from({ length: pages }, (_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a page is its number.
                <PaginationItem key={index}>
                  <PaginationLink
                    href={`#page-${index + 1}`}
                    isActive={index === current}
                    onClick={goTo(index)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  disabled={current === pages - 1}
                  href="#next"
                  onClick={goTo(current + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </ScreenBody>
    </Screen>
  );
}

function ProductCard({
  onSelect,
  product,
}: {
  onSelect: () => void;
  product: Product;
}) {
  return (
    <li
      className="border-craft-outline bg-craft-surface has-[[data-slot=product-card-open]:focus-visible]:craft-focus relative flex flex-col border-(length:--craft-unit)"
      data-slot="product-card"
    >
      <div
        aria-hidden="true"
        className="bg-craft-sunken aspect-video overflow-hidden [&>img]:size-full [&>img]:object-cover [&>svg]:size-full"
      >
        {product.thumbnail}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi)]">
        <button
          className="font-craft-display cursor-pointer text-left leading-tight text-(length:--craft-label-size) outline-none after:absolute after:inset-0 after:content-[''] hover:underline"
          data-slot="product-card-open"
          onClick={onSelect}
          type="button"
        >
          {product.title}
        </button>
        <p className="font-craft-body text-craft-text-muted text-sm">
          By {product.creator}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          {product.rating === undefined ? null : (
            <span className="font-craft-display flex items-center gap-1 leading-none text-(length:--craft-label-size) tabular-nums">
              <StarIcon />
              <span className="sr-only">Rated </span>
              {product.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span>
            </span>
          )}
          {product.owned ? (
            <Badge className="ml-auto" size="sm" variant="primary">
              Owned
            </Badge>
          ) : (
            <span className="font-craft-display ml-auto flex items-center gap-1 leading-none text-(length:--craft-label-size) tabular-nums">
              <CoinIcon />
              {numbers.format(product.price)}
              <span className="sr-only"> coins</span>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
