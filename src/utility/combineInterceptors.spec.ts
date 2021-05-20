import { combineInterceptors } from "./combineInterceptors";
import { Handler } from "./Handler";
import { HandlerInterceptor } from "./HandlerInterceptor";

describe("combineInterceptors", () => {
  describe("returned interceptor", () => {
    it("calls the handler with the doubly-intercepted result", () => {
      // Arrange
      const firstInterceptor: HandlerInterceptor<number, string> = (
        n: number,
        base: Handler<string>,
      ) => {
        base(`${n}`);
      };
      const secondInterceptor: HandlerInterceptor<string, string[]> = (
        s: string,
        base: Handler<string[]>,
      ) => {
        base([s]);
      };
      const handler = jest.fn();
      // Act
      const combinedInterceptor = combineInterceptors(
        firstInterceptor,
        secondInterceptor,
      );
      combinedInterceptor(1, handler);
      // Assert
      expect(handler).toHaveBeenCalledWith(["1"]);
    });
    it("doesn't call the handler if the first interceptor ignores", () => {
      // Arrange
      const firstInterceptor: HandlerInterceptor<number, string> = (
        n: number,
        base: Handler<string>,
      ) => {
        // Do not call the base handler.
      };
      const secondInterceptor: HandlerInterceptor<string, string[]> = (
        s: string,
        base: Handler<string[]>,
      ) => {
        base([s]);
      };
      const handler = jest.fn();
      // Act
      const combinedInterceptor = combineInterceptors(
        firstInterceptor,
        secondInterceptor,
      );
      combinedInterceptor(1, handler);
      // Assert
      expect(handler).not.toHaveBeenCalled();
    });
    it("doesn't call the handler if the second interceptor ignores", () => {
      // Arrange
      const firstInterceptor: HandlerInterceptor<number, string> = (
        n: number,
        base: Handler<string>,
      ) => {
        base(`${n}`);
      };
      const secondInterceptor: HandlerInterceptor<string, string[]> = (
        s: string,
        base: Handler<string[]>,
      ) => {
        // Do not call the base handler.
      };
      const handler = jest.fn();
      // Act
      const combinedInterceptor = combineInterceptors(
        firstInterceptor,
        secondInterceptor,
      );
      combinedInterceptor(1, handler);
      // Assert
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
