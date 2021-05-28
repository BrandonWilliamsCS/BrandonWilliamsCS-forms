import { FormControlInterface } from "../control";
import { ArrayError, validityFor, ValidatedValue } from "../validation";
import {
  splitValidatedFormArray,
  splitValidatedFormArrayComposite,
} from "./splitValidatedFormArray";

describe("splitValidatedFormArray", () => {
  describe("returned interface", () => {
    it("returns the child value for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<ValidatedValue<string[]>> = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const interfaceArray = splitValidatedFormArray(parentInterface);
      const firstNameInterface = interfaceArray[0];
      // Assert
      expect(firstNameInterface.value).toMatchObject({
        value: "first",
        validity: validityFor({
          variant: "field",
          errors: [{ type: "First item is wrong" }],
        }),
      });
    });
    it("triggers a child onValueChange for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<ValidatedValue<string[]>> = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const interfaceArray = splitValidatedFormArray(parentInterface);
      const firstNameInterface = interfaceArray[0];
      firstNameInterface.onValueChange({
        value: "first?",
        validity: validityFor({
          variant: "field",
          errors: [{ type: "First item is still wrong" }],
        }),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: ["first?", "second"],
        validity: validityFor({
          variant: "array",
          errors: [],
          innerErrors: [
            {
              variant: "field",
              errors: [{ type: "First item is still wrong" }],
            },
            {
              variant: "field",
              errors: [{ type: "Second item is wrong" }],
            },
          ],
        }),
      });
    });
  });
});

describe("splitValidatedFormArrayComposite", () => {
  describe("returned interface", () => {
    it("returns the child value for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<ValidatedValue<string[]>> = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface =
        splitValidatedFormArrayComposite(parentInterface);
      const firstNameInterface = compositeInterface(0);
      // Assert
      expect(firstNameInterface.value).toMatchObject({
        value: "first",
        validity: validityFor({
          variant: "field",
          errors: [{ type: "First item is wrong" }],
        }),
      });
    });
    it("triggers a child onValueChange for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<ValidatedValue<string[]>> = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface =
        splitValidatedFormArrayComposite(parentInterface);
      const firstNameInterface = compositeInterface(0);
      firstNameInterface.onValueChange({
        value: "first?",
        validity: validityFor({
          variant: "field",
          errors: [{ type: "First item is still wrong" }],
        }),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: ["first?", "second"],
        validity: validityFor({
          variant: "array",
          errors: [],
          innerErrors: [
            {
              variant: "field",
              errors: [{ type: "First item is still wrong" }],
            },
            {
              variant: "field",
              errors: [{ type: "Second item is wrong" }],
            },
          ],
        }),
      });
    });
  });
});

const fullError: ArrayError = {
  variant: "array",
  errors: [],
  innerErrors: [
    {
      variant: "field",
      errors: [{ type: "First item is wrong" }],
    },
    {
      variant: "field",
      errors: [{ type: "Second item is wrong" }],
    },
  ],
};
