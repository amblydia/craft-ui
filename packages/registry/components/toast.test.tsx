import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider, type ToastType, useToast } from "./toast";

function AddButton({
  onAction,
  type,
}: {
  onAction?: () => void;
  type?: ToastType;
}) {
  const toast = useToast();
  return (
    <button
      onClick={() =>
        toast.add({
          actionProps: onAction
            ? { children: "Undo", onClick: onAction }
            : undefined,
          description: "Your world was saved to the cloud.",
          timeout: 0,
          title: "World saved",
          type,
        })
      }
      type="button"
    >
      Save
    </button>
  );
}

describe("Toast", () => {
  it("shows a toast added with useToast", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddButton type="success" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("World saved")).toBeInTheDocument();
    expect(
      screen.getByText("Your world was saved to the cloud.")
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="toast"]')?.getAttribute("data-type")
    ).toBe("success");
  });

  it("can be dismissed", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddButton />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    // Base UI hides the close button from screen readers until focus moves
    // into the toasts with F6. It can still be clicked.
    await user.click(await screen.findByLabelText("Dismiss"));

    await waitFor(() =>
      expect(screen.queryByText("World saved")).not.toBeInTheDocument()
    );
  });

  it("runs its action", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddButton onAction={onAction} />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("is announced to screen readers", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddButton type="info" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("World saved");
    expect(screen.getByRole("region")).toBeInTheDocument();
  });
});
