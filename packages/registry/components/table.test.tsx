import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
} from "./table";

describe("Table", () => {
  it("renders headings, rows and a caption", () => {
    render(
      <Table>
        <TableCaption>Your worlds</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Mode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>Island</TableCell>
            <TableCell>Survival</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("table", { name: "Your worlds" })).toBeVisible();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.getByRole("cell", { name: "Island" }).parentElement
    ).toHaveAttribute("data-selected");
  });

  it("sorts from a heading", async () => {
    const onSort = vi.fn();
    const user = userEvent.setup();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onSort={onSort} sortDirection="ascending">
              Name
            </TableHead>
            <TableHead>Mode</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const [name, mode] = screen.getAllByRole("columnheader");
    expect(name).toHaveAttribute("aria-sort", "ascending");
    expect(mode).not.toHaveAttribute("aria-sort");

    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(onSort).toHaveBeenCalledOnce();
  });

  it("has rows for no data and for loading", () => {
    const { rerender } = render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3} />
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "3");
    expect(screen.getByRole("cell")).toHaveTextContent("Nothing to show yet.");

    rerender(
      <Table>
        <TableBody>
          <TableLoading colSpan={3} label="Loading worlds" />
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading worlds");
  });
});
