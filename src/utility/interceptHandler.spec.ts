import { Handler } from "./Handler";
import { interceptHandler } from "./interceptHandler";

describe("interceptHandler", () => {
  describe("returned handler", () => {
    it("calls base handler with given value when interceptor defers", async () => {
      // Arrange
      const handler = jest.fn();
      const interceptor = (value: number, base: Handler<number>) => {
        base(value);
      };
      const interceptedHandler = interceptHandler(handler, interceptor);
      // Act
      interceptedHandler(0);
      // Assert
      expect(handler).toHaveBeenCalledWith(0);
    });
    it("calls base handler with adjusted value when interceptor adjusts", async () => {
      // Arrange
      const handler = jest.fn();
      const interceptor = (value: number, base: Handler<string>) => {
        base(`${value}`);
      };
      const interceptedHandler = interceptHandler(handler, interceptor);
      // Act
      interceptedHandler(0);
      // Assert
      expect(handler).toHaveBeenCalledWith("0");
    });
    it("calls base handler with adjusted value when interceptor adjusts", async () => {
      // Arrange
      const handler = jest.fn();
      const interceptor = (value: number, base: Handler<string>) => {};
      const interceptedHandler = interceptHandler(handler, interceptor);
      // Act
      interceptedHandler(0);
      // Assert
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
