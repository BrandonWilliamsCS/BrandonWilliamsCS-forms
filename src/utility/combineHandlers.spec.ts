import { combineHandlers } from "./combineHandlers";
import { Handler } from "./Handler";

describe("combineHandlers", () => {
  describe("returned handler", () => {
    it("calls the first handler with the handled value", () => {
      // Arrange
      const first: Handler<string> | undefined = jest.fn();
      const second: Handler<string> | undefined = jest.fn();
      // Act
      const combinedHandler = combineHandlers(first, second);
      combinedHandler("test");
      // Assert
      expect(first).toHaveBeenCalledWith("test");
    });
    it("calls the first handler when the second is undefined", () => {
      // Arrange
      const first: Handler<string> | undefined = jest.fn();
      const second: Handler<string> | undefined = undefined;
      // Act
      const combinedHandler = combineHandlers(first, second);
      combinedHandler("test");
      // Assert
      expect(first).toHaveBeenCalled();
    });
    it("calls the second handler with the handled value", () => {
      // Arrange
      const first: Handler<string> | undefined = jest.fn();
      const second: Handler<string> | undefined = jest.fn();
      // Act
      const combinedHandler = combineHandlers(first, second);
      combinedHandler("test");
      // Assert
      expect(second).toHaveBeenCalledWith("test");
    });
    it("calls the second handler when the first is undefined", () => {
      // Arrange
      const first: Handler<string> | undefined = undefined;
      const second: Handler<string> | undefined = jest.fn();
      // Act
      const combinedHandler = combineHandlers(first, second);
      combinedHandler("test");
      // Assert
      expect(second).toHaveBeenCalled();
    });
    it("calls the first handler before the second", () => {
      // Arrange
      const first = jest.fn();
      const second = jest.fn();
      // Act
      const combinedHandler = combineHandlers(first, second);
      combinedHandler("test");
      // Assert
      const firstOrder = first.mock.invocationCallOrder[0];
      const secondOrder = second.mock.invocationCallOrder[0];
      expect(firstOrder).toBeLessThan(secondOrder);
    });
  });
});
