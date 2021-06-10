import { GroupError, validityFor, ValidatedValue } from "../../validation";
import { ValidationError } from "../../primary/ValidationError";
import { extractGroupChild, recombineGroupChild } from "./ValidatedGroupMap";

describe("extractGroupChild", () => {
  it("returns the child value for the given key within the parent value", () => {
    // Arrange
    const parentValue: ValidatedValue<Partial<Name>, ValidationError> = {
      value: {
        first: "Firsty",
        last: "Lastson",
      },
      validity: validityFor(fullError),
    };
    // Act
    const firstNameValue = extractGroupChild(parentValue, "first");
    // Assert
    expect(firstNameValue).toMatchObject({
      value: "Firsty",
      validity: validityFor({
        variant: "field",
        errors: [{ type: "First name is wrong" }],
      }),
    });
  });
  it("returns a default child value for an undefined parent value", () => {
    // Arrange
    const parentValue = undefined;
    // Act
    const firstNameValue = extractGroupChild<Name, keyof Name, ValidationError>(
      parentValue,
      "first",
    );
    // Assert
    expect(firstNameValue).toBeUndefined();
  });
});

describe("recombineGroupChild", () => {
  it("Adjusts the child value for the given key within the parent value", () => {
    // Arrange
    const parentValue: ValidatedValue<Partial<Name>, ValidationError> = {
      value: {
        first: "Firsty",
        last: "Lastson",
      },
      validity: validityFor(fullError),
    };
    const childValue: ValidatedValue<string, ValidationError> = {
      value: "Secondy",
      validity: validityFor({
        variant: "field",
        errors: [{ type: "First name is still wrong" }],
      }),
    };
    // Act
    const nextParentValue = recombineGroupChild(
      parentValue,
      childValue,
      "first",
    );
    // Assert
    expect(nextParentValue).toMatchObject({
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
  it("builds a parent value with only the given key when there is no prior parent value", () => {
    // Arrange
    const parentValue = undefined;
    const childValue: ValidatedValue<string, ValidationError> = {
      value: "Firsty",
      validity: validityFor({
        variant: "field",
        errors: [{ type: "First name is wrong" }],
      }),
    };
    // Act
    const nextParentValue = recombineGroupChild<
      Name,
      keyof Name,
      ValidationError
    >(parentValue, childValue, "first");
    // Assert
    expect(nextParentValue).toMatchObject({
      value: {
        first: "Firsty",
      },
      validity: validityFor({
        variant: "group",
        errors: [],
        innerErrors: {
          first: {
            variant: "field",
            errors: [{ type: "First name is wrong" }],
          },
        },
      }),
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
