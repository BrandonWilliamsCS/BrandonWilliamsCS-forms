import { FormControlInterface } from "../control";
import { GroupError, validityFor, ValidatedValue } from "../validation";
import { splitValidatedFormGroup } from "./splitValidatedFormGroup";

describe("splitValidatedFormGroup", () => {
  describe("returned interface", () => {
    it("returns the child value for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<ValidatedValue<Name>> = {
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
        validity: validityFor({
          variant: "field",
          errors: [{ type: "First name is wrong" }],
        }),
      });
    });
    it("returns a child onValueChange for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<ValidatedValue<Name>> = {
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
        validity: validityFor({
          variant: "field",
          errors: [{ type: "First name is still wrong" }],
        }),
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
            first: {
              variant: "field",
              errors: [{ type: "First name is still wrong" }],
            },
            last: {
              variant: "field",
              errors: [{ type: "Last name is wrong" }],
            },
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

const fullError: GroupError = {
  variant: "group",
  errors: [],
  innerErrors: {
    first: {
      variant: "field",
      errors: [{ type: "First name is wrong" }],
    },
    last: {
      variant: "field",
      errors: [{ type: "Last name is wrong" }],
    },
  },
};
