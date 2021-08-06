import { act, renderHook } from "@testing-library/react-hooks";

import { Handler } from "../utility";
import { ValidatedValue, validityFor, validValidity } from "../validation";
import { testFieldError } from "../validation/validatedValue/testFieldError";
import { useValidatedForm } from "./useValidatedForm";
import { ValidationError } from "./ValidationError";

describe("useValidatedForm", () => {
  describe("currentValue", () => {
    it("is initially undefined", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
      );
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
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
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
      expect(currentValue).toMatchObject({ value: "different value" });
    });
  });
  describe("triggerSubmit", () => {
    it("calls onSubmit with the current and submit values when valid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError, string>(handleSubmit),
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
        triggerSubmit("SaveAndContinue");
      });
      // Assert
      expect(handleSubmit).toHaveBeenCalledWith(
        "different value",
        "SaveAndContinue",
      );
    });
    it("doesn't call onSubmit when the value is invalid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError, string>(handleSubmit),
      );
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validityFor(testFieldError("test-error")),
        });
      });
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit("SaveAndContinue");
      });
      // Assert
      expect(handleSubmit).not.toHaveBeenCalled();
    });
    it("records submit attempt even when submit intercepted", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError, string>(handleSubmit),
      );
      act(() => {
        const { changeValue } = result.current;
        changeValue({
          value: "different value",
          validity: validityFor(testFieldError("test-error")),
        });
      });
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit("SaveAndContinue");
      });
      // Assert
      const { submitAttempted } = result.current;
      expect(submitAttempted).toBe(true);
    });
  });
  describe("submitStatus", () => {
    it("is undefined before first submit", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
      );
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus).toBeUndefined();
    });
    it("reports processing before submit completes", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
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
      const { submitStatus } = result.current;
      expect(submitStatus?.isPending).toBe(true);
    });
    it("uses the submit promise as its source", async () => {
      // Arrange
      const { promise } = makePromise<void>();
      const handleSubmit = jest.fn().mockReturnValue(promise);
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
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
      const { submitStatus } = result.current;
      expect(submitStatus?.source).toBe(promise);
    });
    it("reports results of latest submit", async () => {
      // Arrange
      const { promise, resolve } = makePromise<void>();
      const handleSubmit = jest.fn().mockReturnValue(promise);
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
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
      await act(async () => {
        resolve();
        await promise;
      });
      // Assert
      const { submitStatus } = result.current;
      expect(submitStatus?.isPending).toBe(false);
    });
  });
  describe("submitAttempted", () => {
    it("is initially undefined", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      // Act
      const { result } = renderHook(() =>
        useValidatedForm<string, string, ValidationError>(handleSubmit),
      );
      // Assert
      const { submitAttempted } = result.current;
      expect(submitAttempted).toBe(false);
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
