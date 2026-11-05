import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("accepts text and reports changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input aria-label="Name" onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Steve");

    expect(screen.getByRole("textbox")).toHaveValue("Steve");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("supports password and number types", () => {
    render(
      <>
        <Input aria-label="Password" type="password" />
        <Input aria-label="Seed" type="number" />
      </>
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password"
    );
    expect(screen.getByRole("spinbutton", { name: "Seed" })).toBeVisible();
  });

  it("marks the error state for assistive technology", () => {
    render(<Input aria-label="Name" error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no aria-invalid without an error", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("does not accept typing when disabled", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    await user.type(input, "x");
    expect(input).toHaveValue("");
  });

  it("forwards its ref to the input, as form libraries need", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Name" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("renders icons inside the field and applies className to it", () => {
    render(
      <Input
        aria-label="Search"
        className="w-40"
        leadingIcon={<svg data-testid="icon" />}
      />
    );
    const field = screen.getByTestId("icon").parentElement;
    expect(field).toHaveClass("w-40");
    expect(field).toContainElement(screen.getByRole("textbox"));
  });
});
