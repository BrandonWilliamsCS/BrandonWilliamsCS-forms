import React from "react";
import { render, screen } from "@testing-library/react";

import { FocusableFieldset } from "./FocusableFieldset";

describe("FocusableFieldset", () => {
  it("renders", async () => {
    // Arrange
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    // Act
    render(
      <FocusableFieldset onBlur={onBlur} onFocus={onFocus}>
        child-content
      </FocusableFieldset>,
    );

    // Assert
    expect(screen.getByText("child-content")).toBeInTheDocument();
  });
});
