import { act, renderHook } from "@testing-library/react-hooks";

import { useFormBehavior } from "./useFormBehavior";

describe("useFormBehavior", () => {
  it("initially returns the initial value", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useFormBehavior(handleSubmit, initialValue),
    );
    // Assert
    const { currentValue } = result.current;
    expect(currentValue).toBe(0);
  });
  it("updates the current value when the change function is called", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useFormBehavior(handleSubmit, initialValue),
    );
    act(() => {
      const { changeValue } = result.current;
      changeValue(1);
    });
    // Assert
    const { currentValue } = result.current;
    expect(currentValue).toBe(1);
  });
  it("submits the current value when the submit function is called", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useFormBehavior(handleSubmit, initialValue),
    );
    act(() => {
      const { changeValue } = result.current;
      changeValue(1);
    });
    act(() => {
      const { triggerSubmit } = result.current;
      triggerSubmit();
    });

    // Assert
    expect(handleSubmit).toHaveBeenCalledWith(1);
  });
});
