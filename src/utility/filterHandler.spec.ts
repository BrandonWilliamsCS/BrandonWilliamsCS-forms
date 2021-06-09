import { filterHandler } from "./filterHandler";

describe("filterHandler", () => {
  describe("returned handler", () => {
    it("calls base handler with given value when predicate returns true", () => {
      // Arrange
      const handler = jest.fn();
      const filterPredicate = (n: number) => n % 2 === 0;
      // Act
      const interceptedHandler = filterHandler(handler, filterPredicate);
      interceptedHandler(0);
      // Assert
      expect(handler).toHaveBeenCalledWith(0);
    });
    it("doesn't call base handler when predicate returns false", () => {
      // Arrange
      const handler = jest.fn();
      const filterPredicate = (n: number) => n % 2 === 0;
      // Act
      const interceptedHandler = filterHandler(handler, filterPredicate);
      interceptedHandler(1);
      // Assert
      expect(handler).not.toHaveBeenCalled();
    });
    it("calls base handler with given value when predicate is undefined", () => {
      // Arrange
      const handler = jest.fn();
      const interceptor = undefined;
      const interceptedHandler = filterHandler(handler, interceptor);
      // Act
      interceptedHandler(1);
      // Assert
      expect(handler).toHaveBeenCalledWith(1);
    });
  });
});
