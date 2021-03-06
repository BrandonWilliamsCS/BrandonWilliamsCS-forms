import { ValidationError } from "../validation/ValidationError";
import {
  validityError,
  validityFor,
  mapValidity,
  validValidity,
  Validity,
} from "./Validity";

describe("validityError", () => {
  it("returns undefined when validity is valid", () => {
    // Arrange
    const validity: Validity<ValidationError> = validValidity;
    // Act
    const result = validityError(validity);
    // Assert
    expect(result).toBe(undefined);
  });
  it("returns the component error when validity is invalid", () => {
    // Arrange
    const validity: Validity<ValidationError> = {
      isValid: false,
      error: miscError1,
    };
    // Act
    const result = validityError(validity);
    // Assert
    expect(result).toBe(miscError1);
  });
});

describe("validityFor", () => {
  it("returns invalid validity that wraps the provided error", () => {
    // Arrange
    const error: ValidationError | undefined = miscError1;
    // Act
    const result = validityFor(error);
    // Assert
    expect(result).toMatchObject({
      isValid: false,
      error,
    });
  });
  it("returns valid validity when there is no error", () => {
    // Arrange
    const error: ValidationError | undefined = undefined;
    // Act
    const result = validityFor(error);
    // Assert
    expect(result).toBe(validValidity);
  });
});

describe("mapValidity", () => {
  it("returns invalid validity with error mapped from base error", () => {
    // Arrange
    const baseValidity: Validity<ValidationError> = {
      isValid: false,
      error: miscError1,
    };
    const errorMapper = () => miscError2;
    // Act
    const result = mapValidity(baseValidity, errorMapper);
    // Assert
    expect(result).toMatchObject({
      isValid: false,
      error: miscError2,
    });
  });
  it("returns valid validity when base validity has no error", () => {
    // Arrange
    const baseValidity: Validity<ValidationError> = validValidity;
    const errorMapper = () => miscError2;
    // Act
    const result = mapValidity(baseValidity, errorMapper);
    // Assert
    expect(result).toBe(validValidity);
  });
  it("returns valid validity when base validity error maps to no error", () => {
    // Arrange
    const baseValidity: Validity<ValidationError> = {
      isValid: false,
      error: miscError1,
    };
    const errorMapper = () => undefined;
    // Act
    const result = mapValidity(baseValidity, errorMapper);
    // Assert
    expect(result).toBe(validValidity);
  });
});

const miscError1: ValidationError = {
  type: "error1",
  requiresConfirmation: false,
};
const miscError2: ValidationError = {
  type: "error2",
  requiresConfirmation: false,
};
