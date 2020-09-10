import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { FocusableFieldset } from "./FocusableFieldset";

describe("FocusableFieldset", () => {
  it("renders a fieldset", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    const { container } = render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus}>
        child-content
      </FocusableFieldset>,
    );

    // Assert
    expect(container.querySelector("fieldset")).toBeInTheDocument();
  });

  it("passes along non-focus-event props", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    const { container } = render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus} id="pass-me-through">
        child-content
      </FocusableFieldset>,
    );

    // Assert
    expect(container.querySelector("fieldset")).toHaveAttribute(
      "id",
      "pass-me-through",
    );
  });

  it("calls onFocus when focus first enters the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus}>
        <input data-testid="focusable-child-1" />
      </FocusableFieldset>,
    );
    const focusableChild1 = screen.getByTestId("focusable-child-1");
    fireEvent.focus(focusableChild1);

    // Assert
    expect(onFocus).toHaveBeenCalled();
  });

  it("calls onBlur when focus totally leaves the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus}>
        <input data-testid="focusable-child-1" />
      </FocusableFieldset>,
    );
    const focusableChild1 = screen.getByTestId("focusable-child-1");
    fireEvent.focus(focusableChild1);
    await waitForTick();
    fireEvent.blur(focusableChild1);

    // Assert
    await waitFor(() => expect(onBlur).toHaveBeenCalled());
  });

  it("does not call onFocus when focus moves within the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus}>
        <input data-testid="focusable-child-1" />
        <input data-testid="focusable-child-2" />
      </FocusableFieldset>,
    );
    const focusableChild1 = screen.getByTestId("focusable-child-1");
    const focusableChild2 = screen.getByTestId("focusable-child-2");
    fireEvent.focus(focusableChild1);
    await waitForTick();
    fireEvent.focus(focusableChild2);
    await waitForTick();

    // Assert
    () => expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("does not call onFocus when focus moves within the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus}>
        <input data-testid="focusable-child-1" />
        <input data-testid="focusable-child-2" />
      </FocusableFieldset>,
    );
    const focusableChild1 = screen.getByTestId("focusable-child-1");
    const focusableChild2 = screen.getByTestId("focusable-child-2");
    fireEvent.focus(focusableChild1);
    await waitForTick();
    fireEvent.focus(focusableChild2);
    await waitForTick();

    // Assert
    () => expect(onBlur).not.toHaveBeenCalled();
  });
});

function waitForTick() {
  return new Promise((r) => {
    window.setTimeout(r, 10);
  });
}
