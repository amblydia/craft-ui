import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled href="?page=0" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe("Pagination", () => {
  it("is a labelled navigation landmark", () => {
    render(<Example />);
    expect(
      screen.getByRole("navigation", { name: "Pagination" })
    ).toBeInTheDocument();
  });

  it("marks the current page", () => {
    render(<Example />);
    const current = screen.getByRole("link", { name: "1" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "2" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("turns off a disabled link", () => {
    render(<Example />);
    const previous = screen.getByRole("link", {
      name: "Go to the previous page",
    });
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous).not.toHaveAttribute("href");
    expect(previous).toHaveAttribute("tabindex", "-1");
  });

  it("links to the next page and names the gap", () => {
    render(<Example />);
    expect(
      screen.getByRole("link", { name: "Go to the next page" })
    ).toHaveAttribute("href", "?page=2");
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });
});
