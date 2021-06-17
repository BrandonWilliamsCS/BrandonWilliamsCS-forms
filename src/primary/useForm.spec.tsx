import { act, renderHook } from "@testing-library/react-hooks";

import { Handler } from "../utility";
import { ValidatedValue, validityFor, validValidity } from "../validation";
import { testFieldError } from "../validation/validatedValue/testFieldError";
import { useForm } from "./useForm";
import { ValidationError } from "./ValidationError";

describe("useForm", () => {
  describe("currentValue", () => {
    it("is initially undefined", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
      // Assert
      const { currentValue } = result.current;
      expect(currentValue).toBeUndefined();
    });
  });
  describe("changeValue", () => {
    it("updates the current value when called", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
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
      const changeInterceptor = () => {};
      // Act
      const { result } = renderHook(() =>
        useForm(handleSubmit, undefined, changeInterceptor),
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
      expect(currentValue).toBeUndefined();
    });
  });
  describe("triggerSubmit", () => {
    it("calls onSubmit with the current value when the interceptor continues", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      const secondarySubmitInterceptor = (
        value: ValidatedValue<string, ValidationError>,
        base: Handler<ValidatedValue<string, ValidationError>>,
      ) => {
        base(value);
      };
      // Act
      const { result } = renderHook(() =>
        useForm(handleSubmit, secondarySubmitInterceptor),
      );
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
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
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validityFor(testFieldError("test-error")),
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
      const secondarySubmitInterceptor = (
        value: ValidatedValue<string, ValidationError>,
        base: Handler<ValidatedValue<string, ValidationError>>,
      ) => {};
      // Act
      const { result } = renderHook(() =>
        useForm(handleSubmit, secondarySubmitInterceptor),
      );
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
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
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus).toBeUndefined();
    });
    it("reports processing before submit completes", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus?.isPending).toBe(true);
    });
    it("uses the submit promise as its source", async () => {
      // Arrange
      const { promise } = makePromise<void>();
      const handleSubmit = jest.fn().mockReturnValue(promise);
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
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
      // Act
      const { result } = renderHook(() => useForm(handleSubmit));
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validValidity,
        });
      });
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
