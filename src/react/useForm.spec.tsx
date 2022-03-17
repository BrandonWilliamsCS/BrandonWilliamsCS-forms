import { act, renderHook } from "@testing-library/react-hooks";

import { validityFor, validValidity } from "../value";
import { useForm } from "./useForm";

describe("useForm", () => {
  describe("triggerSubmit", () => {
    it("calls onSubmit with the current and submit values when valid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useForm<string, string, string, string>(handleSubmit),
      );
      act(() => {
        const { formModel } = result.current;
        formModel.valueAdapter.onFormValueChange({
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
    it("calls the current onSubmit even after re-render", async () => {
      // Arrange
      const handleSubmit1 = jest.fn().mockReturnValue(new Promise(() => {}));
      const handleSubmit2 = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result, rerender } = renderHook(
        (handleSubmit) => useForm<string, string, string>(handleSubmit),
        { initialProps: handleSubmit1 },
      );
      act(() => {
        const { formModel } = result.current;
        formModel.valueAdapter.onFormValueChange({
          value: "different value",
          validity: validValidity,
        });
      });
      rerender(handleSubmit2);
      act(() => {
        const { triggerSubmit } = result.current;
        triggerSubmit();
      });
      // Assert
      expect(handleSubmit1).not.toHaveBeenCalled();
      expect(handleSubmit2).toHaveBeenCalled();
    });
    it("doesn't call onSubmit when the value is invalid", async () => {
      // Arrange
      const handleSubmit = jest.fn().mockReturnValue(new Promise(() => {}));
      // Act
      const { result } = renderHook(() =>
        useForm<string, string, string>(handleSubmit),
      );
      act(() => {
        const { formModel } = result.current;
        formModel.valueAdapter.onFormValueChange({
          value: "different value",
          validity: validityFor("test-error"),
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
      const { result } = renderHook(() =>
        useForm<string, string, string>(handleSubmit),
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
        useForm<string, string, string>(handleSubmit),
      );
      act(() => {
        const { formModel } = result.current;
        formModel.valueAdapter.onFormValueChange({
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
        useForm<string, string, string>(handleSubmit),
      );
      act(() => {
        const { formModel } = result.current;
        formModel.valueAdapter.onFormValueChange({
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
        useForm<string, string, string>(handleSubmit),
      );
      act(() => {
        const { formModel } = result.current;
        formModel.valueAdapter.onFormValueChange({
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
