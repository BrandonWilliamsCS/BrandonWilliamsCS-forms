import { act, renderHook } from "@testing-library/react-hooks";

import { Handler } from "../utility/Handler";
import { useInterceptedFormBehavior } from "./useInterceptedFormBehavior";

const submitInterceptor = (value: number, base: Handler<string>) => {
  if (value < 10) {
    const adjustedValue = `${value}`;
    base(adjustedValue);
  }
};

const changeInterceptor = (value: number, base: Handler<number>) => {
  if (value % 2 === 0) {
    base(value);
  }
};

describe("useInterceptedFormBehavior", () => {
  it("initially returns the initial value", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useInterceptedFormBehavior(
        handleSubmit,
        initialValue,
        submitInterceptor,
        changeInterceptor,
      ),
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
      useInterceptedFormBehavior(
        handleSubmit,
        initialValue,
        submitInterceptor,
        changeInterceptor,
      ),
    );
    act(() => {
      const { changeValue } = result.current;
      changeValue(2);
    });
    // Assert
    const { currentValue } = result.current;
    expect(currentValue).toBe(2);
  });
  it("doesn't update the current value if the interceptor ignores the value", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useInterceptedFormBehavior(
        handleSubmit,
        initialValue,
        submitInterceptor,
        changeInterceptor,
      ),
    );
    act(() => {
      const { changeValue } = result.current;
      changeValue(1);
    });
    // Assert
    const { currentValue } = result.current;
    expect(currentValue).toBe(0);
  });
  it("submits the current value when the submit function is called and the interceptor continues", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useInterceptedFormBehavior(
        handleSubmit,
        initialValue,
        submitInterceptor,
        changeInterceptor,
      ),
    );
    act(() => {
      const { changeValue } = result.current;
      changeValue(2);
    });
    act(() => {
      const { triggerSubmit } = result.current;
      triggerSubmit();
    });
    // Assert
    expect(handleSubmit).toHaveBeenCalledWith("2");
  });
  it("doesn't submit when the interceptor ignores submit", () => {
    // Arrange
    const handleSubmit = jest.fn();
    const initialValue: number = 0;
    // Act
    const { result } = renderHook(() =>
      useInterceptedFormBehavior(
        handleSubmit,
        initialValue,
        submitInterceptor,
        changeInterceptor,
      ),
    );
    act(() => {
      const { changeValue } = result.current;
      changeValue(20);
    });
    act(() => {
      const { triggerSubmit } = result.current;
      triggerSubmit();
    });
    // Assert
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
