import React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";

import { DomForm } from "./DomForm";
import { act } from "@testing-library/react-hooks";

describe("DomForm", () => {
  it("forwards its ref to the base form element", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const ref = React.createRef<HTMLFormElement>();
    // Act
    render(
      <DomForm ref={ref} onSubmit={handleSubmit}>
        child-content
      </DomForm>,
    );
    // Assert
    expect(ref.current?.tagName).toBe("FORM");
  });

  it("renders children inside of form element", () => {
    // Arrange
    const handleSubmit = jest.fn();
    // Act
    render(<DomForm onSubmit={handleSubmit}>child-content</DomForm>);
    // Assert
    expect(screen.queryByText("child-content")).not.toBeNull();
  });

  it("passes props through to the form", () => {
    // Arrange
    const handleSubmit = jest.fn();
    // Act
    render(
      // Providing a name both ensures that the form has a form "role" and gives it a prop to check.
      <DomForm onSubmit={handleSubmit} name="test-form">
        child-content
      </DomForm>,
    );
    // Assert
    const form = screen.getByRole("form") as HTMLFormElement;
    expect(form.name).toBe("test-form");
  });

  it("calls onSubmit when DOM submit event fires", () => {
    // Arrange
    const handleSubmit = jest.fn();
    // Act
    render(
      <DomForm onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </DomForm>,
    );
    act(() => {
      const button = screen.getByRole("button") as HTMLFormElement;
      button.click();
    });
    // Assert
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("doesn't call onSubmit when DOM submit event fires but form is disabled", () => {
    // Arrange
    const handleSubmit = jest.fn();
    // Act
    render(
      <DomForm onSubmit={handleSubmit} disabled>
        <button type="submit">Submit</button>
      </DomForm>,
    );
    act(() => {
      const button = screen.getByRole("button") as HTMLFormElement;
      button.click();
    });
    // Assert
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("prevents default DOM submit behavior when form is enabled", () => {
    // Arrange
    const handleSubmit = jest.fn();
    let submitEvent!: Event;
    // Act
    render(
      <DomForm onSubmit={handleSubmit} name="test-form">
        child-content
      </DomForm>,
    );
    act(() => {
      const form = screen.getByRole("form");
      submitEvent = createEvent.submit(form);
      fireEvent(form, submitEvent);
    });
    // Assert
    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it("prevents default DOM submit behavior when form is disabled", () => {
    // Arrange
    const handleSubmit = jest.fn();
    let submitEvent!: Event;
    // Act
    render(
      <DomForm onSubmit={handleSubmit} name="test-form" disabled>
        child-content
      </DomForm>,
    );
    act(() => {
      const form = screen.getByRole("form");
      submitEvent = createEvent.submit(form);
      fireEvent(form, submitEvent);
    });
    // Assert
    expect(submitEvent.defaultPrevented).toBe(true);
  });
});
