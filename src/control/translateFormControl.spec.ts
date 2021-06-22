import { Handler, HandlerInterceptor } from "../utility";
import { FormControlInterface } from "./FormControlInterface";
import { translateFormControl } from "./translateFormControl";

const mapper = (value: number | undefined) => `${value}`;
const changeInterceptor: HandlerInterceptor<string | undefined, number> = (
  value: string | undefined,
  base: Handler<number>,
) => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  // Don't report non-numbers.
  if (!Number.isNaN(parsed)) {
    base(parsed);
  }
};

describe("translateFormControl", () => {
  it("returns a value mapped from the source by the mapper", async () => {
    // Arrange
    const sourceInterface: FormControlInterface<number> = {
      value: 0,
      onValueChange: jest.fn(),
    };
    // Act
    const translatedInterface = translateFormControl(
      sourceInterface,
      mapper,
      changeInterceptor,
    );
    // Assert
    expect(translatedInterface.value).toBe("0");
  });
  it("calls the source onValueChange with a re-mapped value when onValueChange is called", async () => {
    // Arrange
    const sourceInterface: FormControlInterface<number> = {
      value: 0,
      onValueChange: jest.fn(),
    };
    // Act
    const translatedInterface = translateFormControl(
      sourceInterface,
      mapper,
      changeInterceptor,
    );
    translatedInterface.onValueChange("1");
    // Assert
    expect(sourceInterface.onValueChange).toHaveBeenCalledWith(1);
  });
  it("Doesn't call the source onValueChange if the change is intercepted", async () => {
    // Arrange
    const sourceInterface: FormControlInterface<number> = {
      value: 0,
      onValueChange: jest.fn(),
    };
    // Act
    const translatedInterface = translateFormControl(
      sourceInterface,
      mapper,
      changeInterceptor,
    );
    translatedInterface.onValueChange("Not a Number!");
    // Assert
    expect(sourceInterface.onValueChange).not.toHaveBeenCalled();
  });
});
