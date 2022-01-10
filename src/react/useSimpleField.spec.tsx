import { act, renderHook } from "@testing-library/react-hooks";
import { FormControlModel } from "../control";
import { Validity, validValidity } from "../value";
import { useSimpleField } from "./useSimpleField";

describe("useSimpleField", () => {
  it("reports initial value and validity before any changes", async () => {
    // Arrange
    const controlInterface = new FormControlModel<string, string>();
    // Act
    const { result } = renderHook(() =>
      useSimpleField(controlInterface, requiredValidator, ""),
    );
    // Assert
    const { baseValue, validity } = result.current;
    expect(baseValue).toBe("");
    expect(validity).toEqual(requiredErrorValidity);
  });
  it("updates value and validity after external change from interface", async () => {
    // Arrange
    const controlInterface = new FormControlModel<string, string>();
    // Act
    const { result } = renderHook(() =>
      useSimpleField(controlInterface, requiredValidator, ""),
    );
    act(() => {
      controlInterface.setValue("value");
    });
    // Assert
    const { baseValue, validity } = result.current;
    expect(baseValue).toBe("value");
    expect(validity).toEqual(validValidity);
  });
  it("updates value and validity after call to onBaseValueChange", async () => {
    // Arrange
    const controlInterface = new FormControlModel<string, string>();
    // Act
    const { result } = renderHook(() =>
      useSimpleField(controlInterface, requiredValidator, ""),
    );
    act(() => {
      const { onBaseValueChange } = result.current;
      onBaseValueChange("value");
    });
    // Assert
    const { baseValue, validity } = result.current;
    expect(baseValue).toBe("value");
    expect(validity).toEqual(validValidity);
  });
  it("notifies interface of new form value after call to onBaseValueChange", async () => {
    // Arrange
    const controlInterface = new FormControlModel<string, string>();
    const formValueListener = jest.fn();
    controlInterface.subscribe({ next: formValueListener });
    // Act
    const { result } = renderHook(() =>
      useSimpleField(controlInterface, requiredValidator, ""),
    );
    act(() => {
      const { onBaseValueChange } = result.current;
      onBaseValueChange("value");
    });
    // Assert
    expect(formValueListener).toHaveBeenCalledWith({
      value: "value",
      validity: validValidity,
    });
  });
});

function requiredValidator(value: string): string[] | undefined {
  return value ? undefined : ["required"];
}

const requiredErrorValidity: Validity<string> = {
  isValid: false,
  error: { variant: "field", errors: ["required"] },
};
