import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Example({
  onValueChange,
}: {
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs defaultValue="worlds" onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="worlds">Worlds</TabsTrigger>
        <TabsTrigger disabled value="realms">
          Realms
        </TabsTrigger>
        <TabsTrigger value="servers">Servers</TabsTrigger>
      </TabsList>
      <TabsContent value="worlds">World list</TabsContent>
      <TabsContent value="realms">Realm list</TabsContent>
      <TabsContent value="servers">Server list</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the panel of the selected tab", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Worlds" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("World list");
  });

  it("switches by pointer", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Servers" }));
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Server list")
    );
    expect(onValueChange).toHaveBeenCalledWith("servers", expect.anything());
  });

  it("moves with the arrow keys and can't activate a disabled tab", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole("tab", { name: "Worlds" })).toHaveFocus();

    // A disabled tab can take focus, so screen reader users can find it.
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Realms" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("World list");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Servers" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Server list")
    );
  });

  it("does not select a disabled tab", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("tab", { name: "Realms" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("World list");
  });

  it("marks the variant on the list", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="segmented">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "segmented"
    );
  });
});
