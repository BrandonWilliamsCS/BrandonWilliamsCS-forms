import React from "react";
import { render, act, fireEvent, waitFor } from "@testing-library/react";

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
    const { container } = render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus} id="pass-me-through">
        <input id="focusable-child-1" />
      </FocusableFieldset>,
    );
    const focusableChild1 = container.querySelector("#focusable-child-1")!;
    act(() => {
      fireEvent.focus(focusableChild1);
    });

    // Assert
    expect(onFocus).toHaveBeenCalled();
  });

  it("calls onBlur when focus totally leaves the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    const { container } = render(
      <>
        <FocusableFieldset
          onBlur={onBlur}
          onFocus={onFocus}
          id="pass-me-through"
        >
          <input id="focusable-child-1" />
        </FocusableFieldset>
        <input id="focusable-sibling-1" />
      </>,
    );
    const focusableChild1 = container.querySelector("#focusable-child-1")!;
    const focusableSibling1 = container.querySelector("#focusable-sibling-1")!;
    await act(async () => {
      fireEvent.focus(focusableChild1);
      // Need to give React time to adjust to state
      await waitForTick();
      fireEvent.blur(focusableChild1);
    });

    // Assert
    await waitFor(() => expect(onBlur).toHaveBeenCalled());
  });

  it("does not call onFocus when focus moves within the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    const { container } = render(
      <>
        <FocusableFieldset
          onBlur={onBlur}
          onFocus={onFocus}
          id="pass-me-through"
        >
          <input id="focusable-child-1" />
          <input id="focusable-child-2" />
        </FocusableFieldset>
      </>,
    );
    const focusableChild1 = container.querySelector("#focusable-child-1")!;
    const focusableChild2 = container.querySelector("#focusable-child-2")!;
    await act(async () => {
      fireEvent.focus(focusableChild1);
      // Need to give React time to adjust to state
      await waitForTick();
      fireEvent.blur(focusableChild1);
      fireEvent.focus(focusableChild2);
    });
    await waitForTick();

    // Assert
    () => expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("does not call onFocus when focus moves within the element", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    const { container } = render(
      <>
        <FocusableFieldset
          onBlur={onBlur}
          onFocus={onFocus}
          id="pass-me-through"
        >
          <input id="focusable-child-1" />
          <input id="focusable-child-2" />
        </FocusableFieldset>
      </>,
    );
    const focusableChild1 = container.querySelector("#focusable-child-1")!;
    const focusableChild2 = container.querySelector("#focusable-child-2")!;
    await act(async () => {
      fireEvent.focus(focusableChild1);
      // Need to give React time to adjust to state
      await waitForTick();
      fireEvent.blur(focusableChild1);
      fireEvent.focus(focusableChild2);
    });
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
