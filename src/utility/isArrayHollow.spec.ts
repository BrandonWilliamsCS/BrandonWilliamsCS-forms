import { isArrayHollow } from "./isArrayHollow";

describe("isArrayHollow", () => {
  it("reports an empty array as hollow", async () => {
    // Arrange
    const arr: (number | undefined)[] = [];
    // Act
    const result = isArrayHollow(arr);
    // Assert
    expect(result).toBe(true);
  });
  it("reports an array of undefined as hollow", async () => {
    // Arrange
    const arr: (number | undefined)[] = [undefined, undefined];
    // Act
    const result = isArrayHollow(arr);
    // Assert
    expect(result).toBe(true);
  });
  it("reports an array of numbers as not hollow", async () => {
    // Arrange
    const arr: (number | undefined)[] = [1, 2];
    // Act
    const result = isArrayHollow(arr);
    // Assert
    expect(result).toBe(false);
  });
  it("reports a mixed array of nubmers and undefined as not hollow", async () => {
    // Arrange
    const arr: (number | undefined)[] = [1, undefined];
    // Act
    const result = isArrayHollow(arr);
    // Assert
    expect(result).toBe(false);
  });
});
