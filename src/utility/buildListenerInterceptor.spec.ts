import { buildListenerInterceptor } from "./buildListenerInterceptor";
import { Handler } from "./Handler";

describe("buildListenerInterceptor", () => {
  describe("returned interceptor", () => {
    it("calls both the base and listener handlers", () => {
      // Arrange
      const baseHandler: Handler<number> = jest.fn();
      const listenerHandler: Handler<number> = jest.fn();
      // Act
      const listenerInterceptor = buildListenerInterceptor(listenerHandler);
      listenerInterceptor(1, baseHandler);
      // Assert
      expect(baseHandler).toHaveBeenCalledWith(1);
      expect(listenerHandler).toHaveBeenCalledWith(1);
    });
  });
});
