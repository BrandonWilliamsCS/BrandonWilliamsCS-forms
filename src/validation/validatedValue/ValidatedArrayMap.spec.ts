import { ArrayError, validityFor, ValidatedValue } from "../../validation";
import { ValidationError } from "../../primary/ValidationError";
import { validValidity } from "../Validity";
import { extractArrayChild, recombineArrayChild } from "./ValidatedArrayMap";

describe("extractArrayChild", () => {
  it("returns the child value for the given index within the parent value", () => {
    // Arrange
    const parentValue: ValidatedValue<string[], ValidationError> = {
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
    const parentValue = undefined;
    // Act
    const firstChildValue = extractArrayChild(parentValue, 0);
    // Assert
    expect(firstChildValue).toBeUndefined();
  });
  it("provides no child value for an empty parent cell", () => {
    // Arrange
    const parentValue: ValidatedValue<(string | undefined)[], ValidationError> =
      {
        value: [, "second"],
        validity: validityFor(fullError),
      };
    // Act
    const firstChildValue = extractArrayChild(parentValue, 0);
    // Assert
    expect(firstChildValue).toBeUndefined();
  });
});

describe("recombineArrayChild", () => {
  it("Adjusts the child value for the given index within the parent value", () => {
    // Arrange
    const parentValue: ValidatedValue<string[], ValidationError> = {
      value: ["first", "second"],
      validity: validityFor(fullError),
    };
    const childValue: ValidatedValue<string, ValidationError> = {
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

  it("Maintains empty cells within the parent array", () => {
    // Arrange
    const parentValue: ValidatedValue<(string | undefined)[], ValidationError> =
      {
        value: [,],
        validity: validityFor(fullError),
      };
    const childValue: ValidatedValue<string, ValidationError> = {
      value: "second",
      validity: validValidity,
    };
    // Act
    const nextParentValue = recombineArrayChild(parentValue, childValue, 1);
    // Assert
    expect(0 in nextParentValue.value).toBe(false);
    expect(1 in nextParentValue.value).toBe(true);
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
