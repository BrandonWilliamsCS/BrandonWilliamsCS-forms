import React from "react";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";

import { FormLayout } from "./FormLayout";

describe("FormLayout", () => {
  describe("form element", () => {
    it("renders at root level", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      const { container } = render(
        <FormLayout name="Test Form" onSubmit={onSubmit} submitLabel={"Submit"}>
          child-content
        </FormLayout>,
      );

      // Assert
      const formElement = screen.getByRole("form");
      expect(formElement).toBe(container.firstChild);
    });

    it("uses formClassName prop if present", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          formClassName="test-class"
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const formElement = screen.getByRole("form");
      expect(formElement.className).toBe("test-class");
    });

    it("uses no classname if formClassName prop not present", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout name="Test Form" onSubmit={onSubmit} submitLabel={"Submit"}>
          child-content
        </FormLayout>,
      );

      // Assert
      const formElement = screen.getByRole("form");
      expect(formElement.className).toBe("");
    });

    describe("submit event", () => {
      it("triggers onSubmit prop when form is not disabled", async () => {
        // Arrange
        const onSubmit = jest.fn().mockReturnValue(false);

        // Act
        render(
          <FormLayout
            name="Test Form"
            onSubmit={onSubmit}
            submitLabel={"Submit"}
          >
            child-content
          </FormLayout>,
        );
        const formElement = screen.getByRole("form");
        fireEvent.submit(formElement);

        // Assert
        expect(onSubmit).toHaveBeenCalled();
      });

      it("doesn't trigger onSubmit prop when form is disabled", async () => {
        // Arrange
        const onSubmit = jest.fn();

        // Act
        render(
          <FormLayout
            name="Test Form"
            onSubmit={onSubmit}
            submitLabel={"Submit"}
            disabled
          >
            child-content
          </FormLayout>,
        );
        const formElement = screen.getByRole("form");
        fireEvent.submit(formElement);

        // Assert
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("has default prevented when form is disabled", async () => {
        // Arrange
        const onSubmit = jest.fn();

        // Act
        render(
          <FormLayout
            name="Test Form"
            onSubmit={onSubmit}
            submitLabel={"Submit"}
            disabled
          >
            child-content
          </FormLayout>,
        );
        const formElement = screen.getByRole("form");
        const event = createEvent.submit(formElement);
        fireEvent(formElement, event);

        // Assert
        expect(event.defaultPrevented).toBe(true);
      });
    });
  });

  describe("fieldset element", () => {
    it("renders inside form", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout name="Test Form" onSubmit={onSubmit} submitLabel={"Submit"}>
          child-content
        </FormLayout>,
      );

      // Assert
      const fieldsetElement = screen.getByRole("group");
      const formElement = screen.getByRole("form");
      expect(fieldsetElement).toBe(formElement.firstChild);
    });

    it("uses formBodyClassName prop if present", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          formBodyClassName="test-class"
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const fieldsetElement = screen.getByRole("group");
      const classes = fieldsetElement.className.split(" ");
      expect(classes[1]).toBe("test-class");
    });

    it("uses no classname if formBodyClassName prop not present", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout name="Test Form" onSubmit={onSubmit} submitLabel={"Submit"}>
          child-content
        </FormLayout>,
      );

      // Assert
      const fieldsetElement = screen.getByRole("group");
      const classes = fieldsetElement.className.split(" ");
      expect(classes.length).toBe(1);
    });

    it("is disabled when component is disabled", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          disabled
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const fieldsetElement = screen.getByRole("group");
      expect(fieldsetElement).toHaveAttribute("disabled");
    });

    it("displays component children", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          disabled
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const fieldsetElement = screen.getByRole("group");
      expect(fieldsetElement.innerHTML).toBe("child-content");
    });
  });

  describe("submit button", () => {
    it("triggers submit event when clicked", async () => {
      // Arrange
      const onSubmit = jest.fn().mockImplementation((e: any) => {
        e.preventDefault();
      });

      // Act
      render(
        <FormLayout name="Test Form" onSubmit={onSubmit} submitLabel={"Submit"}>
          child-content
        </FormLayout>,
      );
      const buttonElement = screen.getByRole("button", { name: "Submit" });
      fireEvent.click(buttonElement);

      // Assert
      expect(onSubmit).toHaveBeenCalled();
    });

    it("is disabled when component is disabled", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          disabled
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const buttonElement = screen.getByRole("button", { name: "Submit" });
      expect(buttonElement).toHaveAttribute("disabled");
    });

    it("displays submitLabel prop as contents", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout name="Test Form" onSubmit={onSubmit} submitLabel={"Submit"}>
          child-content
        </FormLayout>,
      );

      // Assert
      const buttonElement = screen.getByRole("button", { name: "Submit" });
      expect(buttonElement).toHaveTextContent("Submit");
    });
  });

  describe("status text", () => {
    it("displays statusText prop as contents", async () => {
      // Arrange
      const onSubmit = jest.fn().mockImplementation((e: any) => {
        e.preventDefault();
      });

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          statusText="status-text"
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const statusElement = screen.getByRole("status");
      expect(statusElement).toHaveTextContent("status-text");
    });

    it("shows as non-error color when not in error mode", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          statusText="status-text"
          hasError={false}
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const statusElement = screen.getByRole("status");
      expect(statusElement).not.toHaveClass("MuiTypography-colorError");
    });

    it("shows as error color when in error mode", async () => {
      // Arrange
      const onSubmit = jest.fn();

      // Act
      render(
        <FormLayout
          name="Test Form"
          onSubmit={onSubmit}
          submitLabel={"Submit"}
          statusText="status-text"
          hasError={true}
        >
          child-content
        </FormLayout>,
      );

      // Assert
      const statusElement = screen.getByRole("status");
      expect(statusElement).toHaveClass("MuiTypography-colorError");
    });
  });
});

function waitForTick() {
  return new Promise((r) => {
    window.setTimeout(r, 10);
  });
}
