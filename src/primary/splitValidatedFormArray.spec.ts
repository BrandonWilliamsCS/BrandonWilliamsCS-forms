import { FormControlInterface } from "../control";
import {
  ArrayError,
  validityFor,
  ValidatedValue,
  validValidity,
} from "../validation";
import { splitValidatedFormArray } from "./splitValidatedFormArray";
import { ValidationError } from "./ValidationError";

describe("splitValidatedFormArray", () => {
  describe("interfaceArray", () => {
    it("returns the child value for the given index within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const { interfaceArray } = splitValidatedFormArray(parentInterface);
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
    it("provides no child interfaces for an undefined parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const { interfaceArray } = splitValidatedFormArray(parentInterface);
      // Assert
      expect(interfaceArray.length).toBe(0);
    });
    it("triggers a child onValueChange for the given index within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const { interfaceArray } = splitValidatedFormArray(parentInterface);
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
  describe("compositeInterface", () => {
    it("returns the child value for the given index within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const { compositeInterface } = splitValidatedFormArray(parentInterface);
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
    it("returns a default child value for an undefined parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const { compositeInterface } = splitValidatedFormArray(parentInterface);
      const firstNameInterface = compositeInterface(0);
      // Assert
      expect(firstNameInterface.value).toBeUndefined();
    });
    it("returns a default child value for an empty parent value cell", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const { compositeInterface } = splitValidatedFormArray(parentInterface);
      // change the second value while keeping the first one empty
      const { onValueChange: changeSecondValue } = compositeInterface(1);
      changeSecondValue({ value: "second", validity: validValidity });
      const firstNameInterface = compositeInterface(0);
      // Assert
      expect(firstNameInterface.value).toBeUndefined();
    });
    it("triggers a child onValueChange for the given index within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: {
          value: ["first", "second"],
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const { compositeInterface } = splitValidatedFormArray(parentInterface);
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
    it("returns a child-only onValueChange for the given key when there is no parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const { compositeInterface } = splitValidatedFormArray(parentInterface);
      const secondNameInterface = compositeInterface(1);
      secondNameInterface.onValueChange({
        value: "second",
        validity: validityFor({
          variant: "field",
          errors: [{ type: "Second item is wrong" }],
        }),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: [, "second"],
        validity: validityFor({
          variant: "array",
          errors: [],
          innerErrors: [
            ,
            {
              variant: "field",
              errors: [{ type: "Second item is wrong" }],
            },
          ],
        }),
      });
    });
    it("returns a onValueChange that maintains empty cells in the parent value", () => {
      // Arrange
      const onParentValueChange = jest.fn();
      const parentInterface: FormControlInterface<
        ValidatedValue<string[], ValidationError>
      > = {
        value: undefined,
        onValueChange: onParentValueChange,
      };
      // Act
      const { compositeInterface } = splitValidatedFormArray(parentInterface);
      // change the second value while keeping the first one empty
      const { onValueChange: changeSecondValue } = compositeInterface(1);
      changeSecondValue({ value: "second", validity: validValidity });
      // Assert
      const nextParentValue: ValidatedValue<string[], ValidationError> =
        onParentValueChange.mock.calls[0][0];
      expect(0 in nextParentValue.value).toBe(false);
    });
  });
});

const fullError: ArrayError<ValidationError> = {
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
