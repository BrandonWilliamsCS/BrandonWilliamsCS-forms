import { Validity, validityFor, validValidity } from "../value";
import { getFieldErrorMessage } from "./getFieldErrorMessage";

function resolveMessage(key: string): string | undefined {
  return key || undefined;
}

describe("getFieldErrorMessage", () => {
  it("returns no message on valid validity", async () => {
    // Arrange
    const validity: Validity<string> = validValidity;
    // Act
    const message = getFieldErrorMessage(validity, resolveMessage);
    // Assert
    expect(message).toBeUndefined();
  });
  it("returns message for first error that resolves to a message", async () => {
    // Arrange
    const validity: Validity<string> = validityFor({
      variant: "field",
      errors: ["", "error"],
    });
    // Act
    const message = getFieldErrorMessage(validity, resolveMessage);
    // Assert
    expect(message).toBe("error");
  });
  it("returns no message if no error resolves to a message", async () => {
    // Arrange
    const validity: Validity<string> = validityFor({
      variant: "field",
      errors: [""],
    });
    // Act
    const message = getFieldErrorMessage(validity, resolveMessage);
    // Assert
    expect(message).toBeUndefined();
  });
});
