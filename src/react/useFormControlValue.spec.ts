import { act, renderHook } from "@testing-library/react-hooks";
import { Validity, validValidity } from "../value";
import { FormValueAdapter } from "../value/transform";
import { useFormControlValue } from "./useFormControlValue";

describe("useFormControlValue", () => {
  it("reports FormValue with initial value before any changes", async () => {
    // Arrange
    const adapter = new FormValueAdapter<string, string[]>();
    // Act
    const { result } = renderHook(() =>
      useFormControlValue(adapter, "", requiredValidator),
    );
    // Assert
    const { formValue } = result.current;
    expect(formValue.value).toBe("");
    expect(formValue.validity).toEqual(requiredErrorValidity);
  });
  it("updates value and validity in response to upstream value", async () => {
    // Arrange
    const adapter = new FormValueAdapter<string, string[]>();
    // Act
    const { result } = renderHook(() =>
      useFormControlValue(adapter, "", requiredValidator),
    );
    act(() => {
      adapter.setValue("value");
    });
    // Assert
    const { formValue } = result.current;
    expect(formValue.value).toBe("value");
    expect(formValue.validity).toEqual(validValidity);
  });
  it("updates value and validity after call to onValueChange", async () => {
    // Arrange
    const adapter = new FormValueAdapter<string, string[]>();
    // Act
    const { result } = renderHook(() =>
      useFormControlValue(adapter, "", requiredValidator),
    );
    act(() => {
      const { onValueChange } = result.current;
      onValueChange("value");
    });
    // Assert
    const { formValue } = result.current;
    expect(formValue.value).toBe("value");
    expect(formValue.validity).toEqual(validValidity);
  });
  it("notifies interface of new form value in response to upstream value", async () => {
    // Arrange
    const adapter = new FormValueAdapter<string, string[]>();
    const formValueListener = jest.fn();
    adapter.formValues.subscribe({ next: formValueListener });
    // Act
    const { result } = renderHook(() =>
      useFormControlValue(adapter, "", requiredValidator),
    );
    act(() => {
      adapter.setValue("value");
    });
    // Assert
    expect(formValueListener).toHaveBeenCalledWith({
      value: "value",
      validity: validValidity,
    });
  });
  it("notifies interface of new form value after call to onValueChange", async () => {
    // Arrange
    const adapter = new FormValueAdapter<string, string[]>();
    const formValueListener = jest.fn();
    adapter.formValues.subscribe({ next: formValueListener });
    // Act
    const { result } = renderHook(() =>
      useFormControlValue(adapter, "", requiredValidator),
    );
    act(() => {
      const { onValueChange } = result.current;
      onValueChange("value");
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

const requiredErrorValidity: Validity<string[]> = {
  isValid: false,
  error: ["required"],
};
