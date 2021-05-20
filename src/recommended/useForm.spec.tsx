import { act, renderHook } from "@testing-library/react-hooks";
import { Handler } from "../utility";

import { validityFor, validValidity } from "../validation";
import { FormControlState } from "./FormControlState";
import { useForm } from "./useForm";

describe("useForm", () => {
  describe("currentValue", () => {
    it("is initially equal to the provided initial value, marked as valid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      // Assert
      const { currentValue } = result.current;
      expect(currentValue).toMatchObject({
        value: "initial value",
        validity: validValidity,
      });
    });
  });
  describe("changeValue", () => {
    it("updates the current value when called", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
      // Assert
      const { currentValue } = result.current;
      expect(currentValue).toMatchObject({ value: "different value" });
    });
    it("doesn't update the current value if the interceptor ignores", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const initialValue = "initial value";
      const changeInterceptor = () => {};
      // Act
      const { result } = renderHook(() =>
        useForm(handleSubmit, initialValue, undefined, changeInterceptor),
      );
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
      // Assert
      const { currentValue } = result.current;
      expect(currentValue).toMatchObject({ value: "initial value" });
    });
  });
  describe("triggerSubmit", () => {
    it("calls onSubmit with the current value when the interceptor continues", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      const initialValue = "initial value";
      const secondarySubmitInterceptor = (
        value: FormControlState<string>,
        base: Handler<FormControlState<string>>,
      ) => {
        base(value);
      };
      // Act
      const { result } = renderHook(() =>
        useForm(handleSubmit, initialValue, secondarySubmitInterceptor),
      );
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      expect(handleSubmit).toHaveBeenCalled();
    });
    it("doesn't call onSubmit when the value is invalid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validityFor({
            variant: "field",
            errors: [{ type: "test-error" }],
          }),
        });
      });
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      expect(handleSubmit).not.toHaveBeenCalled();
    });
    it("doesn't call onSubmit when the secondary interceptor ignores", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      const initialValue = "initial value";
      const secondarySubmitInterceptor = (
        value: FormControlState<string>,
        base: Handler<FormControlState<string>>,
      ) => {};
      // Act
      const { result } = renderHook(() =>
        useForm(handleSubmit, initialValue, secondarySubmitInterceptor),
      );
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });
  describe("submitStatus", () => {
    it("is undefined before first submit", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus).toBeUndefined();
    });
    it("reports processing before submit completes", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus?.isPending).toBe(true);
    });
    it("uses the submit promise as its sorce", async () => {
      // Arrange
      const { promise } = makePromise<void>();
      const handleSubmit = jest.fn().mockReturnValue(promise);
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus?.source).toBe(promise);
    });
    it("reports results of latest submit", async () => {
      // Arrange
      const { promise, resolve } = makePromise<void>();
      const handleSubmit = jest.fn().mockReturnValue(promise);
      const initialValue = "initial value";
      // Act
      const { result } = renderHook(() => useForm(handleSubmit, initialValue));
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      await act(async () => {
        resolve();
        await promise;
      });
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus?.isPending).toBe(false);
    });
  });
});

function makePromise<T, E = any>() {
  let resolve!: (t: T) => void;
  let reject!: (e: E) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { promise, resolve, reject };
}
