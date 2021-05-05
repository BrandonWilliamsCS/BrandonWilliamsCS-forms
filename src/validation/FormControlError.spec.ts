import {
  addArrayedError,
  addGroupedError,
  FormControlError,
  ArrayError,
  GroupError,
} from "./FormControlError";

describe("addArrayedError", () => {
  it("returns undefined if current and next are non-errors", () => {
    // Arrange
    const currentArrayError: ArrayError | undefined = undefined;
    const nextItemError: FormControlError | undefined = undefined;
    // Act
    const result = addArrayedError(currentArrayError, nextItemError, 0);
    // Assert
    expect(result).toBe(undefined);
  });
  it("returns undefined if next was the only error and was cleared", () => {
    // Arrange
    const currentArrayError: ArrayError | undefined = arrayFor([miscError]);
    const nextItemError: FormControlError | undefined = undefined;
    // Act
    const result = addArrayedError(currentArrayError, nextItemError, 0);
    // Assert
    expect(result).toBe(undefined);
  });
  it("returns an array with next error when current was undefined", () => {
    // Arrange
    const currentArrayError: ArrayError | undefined = undefined;
    const nextItemError: FormControlError | undefined = miscError;
    // Act
    const result = addArrayedError(currentArrayError, nextItemError, 0);
    // Assert
    expect(result).toMatchObject({ innerErrors: [miscError] });
  });
  it("returns an array replacing next item when previously present", () => {
    // Arrange
    const currentArrayError: ArrayError | undefined = arrayFor([miscError2]);
    const nextItemError: FormControlError | undefined = miscError;
    // Act
    const result = addArrayedError(currentArrayError, nextItemError, 0);
    // Assert
    expect(result).toMatchObject({ innerErrors: [miscError] });
  });
  it("maintains other item errors when next item is cleared", () => {
    // Arrange
    const currentArrayError: ArrayError | undefined = arrayFor([
      miscError,
      miscError2,
    ]);
    const nextItemError: FormControlError | undefined = undefined;
    // Act
    const result = addArrayedError(currentArrayError, nextItemError, 0);
    // Assert
    expect(result).toMatchObject({ innerErrors: [undefined, miscError2] });
  });
  it("maintains array-level errors", () => {
    // Arrange
    const currentArrayError: ArrayError | undefined = {
      variant: "array",
      errors: [{ type: "innerError" }],
      innerErrors: [],
    };
    const nextItemError: FormControlError | undefined = miscError;
    // Act
    const result = addArrayedError(currentArrayError, nextItemError, 0);
    // Assert
    expect(result).toMatchObject({
      variant: "array",
      errors: [{ type: "innerError" }],
      innerErrors: [miscError],
    });
  });
});

describe("addGroupedError", () => {
  it("returns undefined if current and next are non-errors", () => {
    // Arrange
    const currentGroupError: GroupError | undefined = undefined;
    const nextItemError: FormControlError | undefined = undefined;
    // Act
    const result = addGroupedError(currentGroupError, nextItemError, "item");
    // Assert
    expect(result).toBe(undefined);
  });
  it("returns undefined if next was the only error and was cleared", () => {
    // Arrange
    const currentGroupError: GroupError | undefined = groupFor({
      item: miscError,
    });
    const nextItemError: FormControlError | undefined = undefined;
    // Act
    const result = addGroupedError(currentGroupError, nextItemError, "item");
    // Assert
    expect(result).toBe(undefined);
  });
  it("returns an object with next error when current was undefined", () => {
    // Arrange
    const currentGroupError: GroupError | undefined = undefined;
    const nextItemError: FormControlError | undefined = miscError;
    // Act
    const result = addGroupedError(currentGroupError, nextItemError, "item");
    // Assert
    expect(result).toMatchObject({ innerErrors: { item: miscError } });
  });
  it("returns an object replacing next item when previously present", () => {
    // Arrange
    const currentGroupError: GroupError | undefined = groupFor({
      item: miscError2,
    });
    const nextItemError: FormControlError | undefined = miscError;
    // Act
    const result = addGroupedError(currentGroupError, nextItemError, "item");
    // Assert
    expect(result).toMatchObject({ innerErrors: { item: miscError } });
  });
  it("maintains other item errors when next item is cleared", () => {
    // Arrange
    const currentGroupError: GroupError | undefined = groupFor({
      item: miscError,
      other: miscError2,
    });
    const nextItemError: FormControlError | undefined = undefined;
    // Act
    const result = addGroupedError(currentGroupError, nextItemError, "item");
    // Assert
    expect(result).toMatchObject({ innerErrors: { other: miscError2 } });
  });
  it("maintains group-level errors", () => {
    // Arrange
    const currentGroupError: GroupError | undefined = {
      variant: "group",
      errors: [{ type: "innerError" }],
      innerErrors: {},
    };
    const nextItemError: FormControlError | undefined = miscError;
    // Act
    const result = addGroupedError(currentGroupError, nextItemError, "item");
    // Assert
    expect(result).toMatchObject({
      variant: "group",
      errors: [{ type: "innerError" }],
      innerErrors: { item: miscError },
    });
  });
});

const miscError: FormControlError = {
  variant: "field",
  errors: [{ type: "error" }],
};
const miscError2: FormControlError = {
  variant: "field",
  errors: [{ type: "error2" }],
};

function arrayFor(
  innerErrors: Array<FormControlError | undefined>,
): ArrayError {
  return {
    variant: "array",
    errors: [],
    innerErrors,
  };
}

function groupFor(
  innerErrors: Record<string, FormControlError | undefined>,
): GroupError {
  return {
    variant: "group",
    errors: [],
    innerErrors,
  };
}
