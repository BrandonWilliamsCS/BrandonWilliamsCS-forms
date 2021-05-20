import { validityFor, validValidity } from "../validation";
import { FormControlState } from "./FormControlState";
import { interceptValidatedSubmit } from "./interceptValidatedSubmit";

describe("interceptValidatedSubmit", () => {
  it("calls the submit function with the value when valid", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const stateValue: FormControlState<Name> = {
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
    const stateValue: FormControlState<Name> = {
      value: {
        first: "Firsty",
        last: "Lastson",
      },
      validity: validityFor({
        variant: "group",
        errors: [{ type: "TEST_ERROR" }],
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
