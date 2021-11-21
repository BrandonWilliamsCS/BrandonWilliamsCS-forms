import { FormValue, mapFormValue } from "./FormValue";
import { validValidity } from "./Validity";

describe("mapFormValue", () => {
  it("returns a formValue with the mapped value and same validity", () => {
    // Arrange
    const baseValue: FormValue<number, any> = {
      value: 1,
      validity: validValidity,
    };
    const mapper = (n: number) => n.toString();
    // Act
    const result = mapFormValue(baseValue, mapper);
    // Assert
    expect(result).toEqual({
      value: "1",
      validity: validValidity,
    });
  });
});
