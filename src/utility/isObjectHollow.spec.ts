import { isObjectHollow } from "./isObjectHollow";

describe("isObjectHollow", () => {
  it("reports an empty object as hollow", async () => {
    // Arrange
    const obj = {};
    // Act
    const result = isObjectHollow(obj);
    // Assert
    expect(result).toBe(true);
  });
  it("reports an object of undefined-valued keys as hollow", async () => {
    // Arrange
    const obj = { x: undefined, y: undefined };
    // Act
    const result = isObjectHollow(obj);
    // Assert
    expect(result).toBe(true);
  });
  it("reports an object of number-valued keys as not hollow", async () => {
    // Arrange
    const obj = { x: 1, y: 2 };
    // Act
    const result = isObjectHollow(obj);
    // Assert
    expect(result).toBe(false);
  });
  it("reports a mixed object of nubmer- and undefined-valued keys as not hollow", async () => {
    // Arrange
    const obj = { x: 1, y: undefined };
    // Act
    const result = isObjectHollow(obj);
    // Assert
    expect(result).toBe(false);
  });
});
