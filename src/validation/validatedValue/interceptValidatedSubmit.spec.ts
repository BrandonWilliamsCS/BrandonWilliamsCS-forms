import { validityFor, validValidity } from "..";
import { ValidatedValue } from "../ValidatedValue";
import { ValidationError } from "../../primary/ValidationError";
import { interceptValidatedSubmit } from "./interceptValidatedSubmit";

describe("interceptValidatedSubmit", () => {
  it("calls the submit function with the value when valid", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const stateValue: ValidatedValue<Name, ValidationError> = {
      value: {
        first: "Firsty",
        last: "Lastson",
      },
      validity: validValidity,
    };
    // Act
    interceptValidatedSubmit(stateValue, handleSubmit);
    // Assert
    expect(handleSubmit).toHaveBeenCalledWith(stateValue.value);
  });
  it("does not call the submit function when invalid", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const stateValue: ValidatedValue<Name, ValidationError> = {
      value: {
        first: "Firsty",
        last: "Lastson",
      },
      validity: validityFor({
        variant: "group",
        errors: [{ type: "TEST_ERROR", requiresConfirmation: false }],
        innerErrors: {},
      }),
    };
    // Act
    interceptValidatedSubmit(stateValue, handleSubmit);
    // Assert
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});

interface Name {
  first: string;
  last: string;
}
