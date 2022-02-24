import { combineValidators } from "./combineValidators";

describe("combineValidators", () => {
  it("returns errors from all validators", async () => {
    // Arrange
    const validator1 = () => ["error1"];
    const validator2 = () => ["error2"];
    // Act
    const combinedValidator = combineValidators<string, string>(
      validator1,
      validator2,
    );
    const errors = combinedValidator("value");
    // Assert
    expect(errors).toEqual(["error1", "error2"]);
  });
  it("ignores undefined validators", async () => {
    // Arrange
    const validator1 = undefined;
    const validator2 = () => ["error2"];
    // Act
    const combinedValidator = combineValidators<string, string>(
      validator1,
      validator2,
    );
    const errors = combinedValidator("value");
    // Assert
    expect(errors).toEqual(["error2"]);
  });
});
