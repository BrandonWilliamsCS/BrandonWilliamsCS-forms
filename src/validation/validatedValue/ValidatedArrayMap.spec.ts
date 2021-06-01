import { ArrayError, validityFor, ValidatedValue } from "../../validation";
import { extractArrayChild, recombineArrayChild } from "./ValidatedArrayMap";

describe("extractArrayChild", () => {
  it("returns the child value for the given index within the parent value", () => {
    // Arrange
    const parentValue: ValidatedValue<string[]> = {
      value: ["first", "second"],
      validity: validityFor(fullError),
    };
    // Act
    const firstChildValue = extractArrayChild(parentValue, 0);
    // Assert
    expect(firstChildValue).toMatchObject({
      value: "first",
      validity: validityFor({
        variant: "field",
        errors: [{ type: "First item is wrong" }],
      }),
    });
  });
  it("provides no child value for an undefined parent value", () => {
    // Arrange
    const parentInterface = undefined;
    // Act
    const firstChildValue = extractArrayChild(parentInterface, 0);
    // Assert
    expect(firstChildValue).toBeUndefined();
  });
});

describe("recombineArrayChild", () => {
  it("Adjusts the child value for the given index within the parent value", () => {
    // Arrange
    const parentValue: ValidatedValue<string[]> = {
      value: ["first", "second"],
      validity: validityFor(fullError),
    };
    const childValue: ValidatedValue<string> = {
      value: "first?",
      validity: validityFor({
        variant: "field",
        errors: [{ type: "First item is still wrong" }],
      }),
    };
    // Act
    const nextParentValue = recombineArrayChild(parentValue, childValue, 0);
    // Assert
    expect(nextParentValue).toMatchObject({
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
