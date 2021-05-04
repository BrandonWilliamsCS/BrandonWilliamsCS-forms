import { FormControlInterface } from "./FormControlInterface";
import { translateFormControl } from "./translateFormControl";

const mapper = (value: number) => `${value}`;
const remapper = (value: string) => Number.parseInt(value, 10);

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
      remapper,
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
      remapper,
    );
    translatedInterface.onValueChange("1");
    // Assert
    expect(sourceInterface.onValueChange).toHaveBeenCalledWith(1);
  });
});
