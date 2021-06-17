import { FormControlInterface } from "../control";
import { GroupError, validityFor, ValidatedValue } from "../validation";
import { testFieldError } from "../validation/validatedValue/testFieldError";
import { splitValidatedFormGroup } from "./splitValidatedFormGroup";
import { ValidationError } from "./ValidationError";

describe("splitValidatedFormGroup", () => {
  describe("returned interface", () => {
    it("returns the child value for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<Partial<Name>, ValidationError>
      > = {
        value: {
          value: {
            first: "Firsty",
            last: "Lastson",
          },
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitValidatedFormGroup(parentInterface);
      const firstNameInterface = compositeInterface("first");
      // Assert
      expect(firstNameInterface.value).toMatchObject({
        value: "Firsty",
        validity: validityFor(testFieldError("First name is wrong")),
      });
    });
    it("returns a default child value for an undefined parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<Partial<Name>, ValidationError>
      > = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitValidatedFormGroup(parentInterface);
      const firstNameInterface = compositeInterface("first");
      // Assert
      expect(firstNameInterface.value).toBeUndefined();
    });
    it("returns a child onValueChange for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<Partial<Name>, ValidationError>
      > = {
        value: {
          value: {
            first: "Firsty",
            last: "Lastson",
          },
          validity: validityFor(fullError),
        },
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitValidatedFormGroup(parentInterface);
      const firstNameInterface = compositeInterface("first");
      firstNameInterface.onValueChange({
        value: "Secondy",
        validity: validityFor(testFieldError("First name is still wrong")),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: {
          first: "Secondy",
          last: "Lastson",
        },
        validity: validityFor({
          variant: "group",
          errors: [],
          innerErrors: {
            first: testFieldError("First name is still wrong"),
            last: testFieldError("Last name is wrong"),
          },
        }),
      });
    });
    it("returns a child-only onValueChange for the given key when there is no parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<
        ValidatedValue<Partial<Name>, ValidationError>
      > = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitValidatedFormGroup(parentInterface);
      const firstNameInterface = compositeInterface("first");
      firstNameInterface.onValueChange({
        value: "Secondy",
        validity: validityFor(testFieldError("First name is wrong")),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: {
          first: "Secondy",
        },
        validity: validityFor({
          variant: "group",
          errors: [],
          innerErrors: {
            first: testFieldError("First name is wrong"),
          },
        }),
      });
    });
  });
});

interface Name {
  first: string;
  last: string;
}

const fullError: GroupError<ValidationError> = {
  variant: "group",
  errors: [],
  innerErrors: {
    first: testFieldError("First name is wrong"),
    last: testFieldError("Last name is wrong"),
  },
};
