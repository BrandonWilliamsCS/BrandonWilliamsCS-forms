import { act, renderHook } from "@testing-library/react-hooks";

import { ValidationError } from "../validation/ValidationError";
import { FieldError, validityFor, validValidity } from "../value";
import { useForm } from "./useForm";

describe("useForm", () => {
  describe("triggerSubmit", () => {
    it("calls onSubmit with the current and submit values when valid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useForm<string, ValidationError, string>(handleSubmit),
      );
      act(() => {
        const { controlInterface } = result.current;
        controlInterface.onValueChange({
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
        useForm<string, ValidationError, string>(handleSubmit),
      );
      act(() => {
        const { controlInterface } = result.current;
        controlInterface.onValueChange({
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
        useForm<string, ValidationError, string>(handleSubmit),
      );
      act(() => {
        const { controlInterface } = result.current;
        controlInterface.onValueChange({
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
        useForm<string, ValidationError>(handleSubmit),
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
        useForm<string, ValidationError>(handleSubmit),
      );
      act(() => {
        const { controlInterface } = result.current;
        controlInterface.onValueChange({
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
        useForm<string, ValidationError>(handleSubmit),
      );
      act(() => {
        const { controlInterface } = result.current;
        controlInterface.onValueChange({
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
        useForm<string, ValidationError>(handleSubmit),
      );
      act(() => {
        const { controlInterface } = result.current;
        controlInterface.onValueChange({
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
        useForm<string, ValidationError>(handleSubmit),
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

function testFieldError(type: string): FieldError<ValidationError> {
  return {
    variant: "field",
    errors: [{ type, requiresConfirmation: false }],
  };
}
