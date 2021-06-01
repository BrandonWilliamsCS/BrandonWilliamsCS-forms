import { FormControlInterface } from "./FormControlInterface";
import { facilitateIterativeChanges } from "./facilitateIterativeChanges";

describe("facilitateIterativeChanges", () => {
  describe("returned handler", () => {
    // Note: it's hard to contrast a successful case with a failed one because
    // the nature of this function is to change the handler signature rather
    // than simply wrap it.
    // The key detail here is that `stepper` is not based only on the "original"
    // value but can instead compute a "next" value from any previous value.
    it("calls the source onValueChanges with the latest computed value", () => {
      // Arrange
      const originalInterface: FormControlInterface<number> = {
        value: 0,
        onValueChange: jest.fn(),
      };
      const stepper = (n: number | undefined) => (n ?? 0) + 1;
      // Act
      const iteratableHandler = facilitateIterativeChanges(originalInterface);
      iteratableHandler(stepper);
      iteratableHandler(stepper);
      // Assert
      expect(originalInterface.onValueChange).toHaveBeenCalledWith(2);
    });
  });
});
