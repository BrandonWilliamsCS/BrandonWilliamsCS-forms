import { FormControlInterface } from "../../control";
import { ValidatedValue, ValidationError } from "../../primary";
import { Handler, HandlerInterceptor } from "../../utility";
import { validityFor } from "../Validity";
import { testFieldError } from "./testFieldError";
import { translateValidatedFormControl } from "./translateValidatedFormControl";

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

describe("translateValidatedFormControl", () => {
  it("returns a value mapped from the source by the mapper, preserving validity", async () => {
    // Arrange
    const sourceInterface: FormControlInterface<ValidatedValue<number, any>> = {
      value: validatedValueAround(0),
      onValueChange: jest.fn(),
    };
    // Act
    const translatedInterface = translateValidatedFormControl(
      sourceInterface,
      mapper,
      changeInterceptor,
    );
    // Assert
    expect(translatedInterface.value).toStrictEqual(validatedValueAround("0"));
  });
  it("calls the source onValueChange with a re-mapped value (preserving validity) when onValueChange is called", async () => {
    // Arrange
    const sourceInterface: FormControlInterface<ValidatedValue<number, any>> = {
      value: validatedValueAround(0),
      onValueChange: jest.fn(),
    };
    // Act
    const translatedInterface = translateValidatedFormControl(
      sourceInterface,
      mapper,
      changeInterceptor,
    );
    translatedInterface.onValueChange(validatedValueAround("1"));
    // Assert
    expect(sourceInterface.onValueChange).toHaveBeenCalledWith(
      validatedValueAround(1),
    );
  });
  it("Doesn't call the source onValueChange if the change is intercepted", async () => {
    // Arrange
    const sourceInterface: FormControlInterface<ValidatedValue<number, any>> = {
      value: validatedValueAround(0),
      onValueChange: jest.fn(),
    };
    // Act
    const translatedInterface = translateValidatedFormControl(
      sourceInterface,
      mapper,
      changeInterceptor,
    );
    translatedInterface.onValueChange(validatedValueAround("Not a Number!"));
    // Assert
    expect(sourceInterface.onValueChange).not.toHaveBeenCalled();
  });
});

function validatedValueAround<T>(value: T): ValidatedValue<T, ValidationError> {
  return {
    value,
    validity: validityFor(testFieldError("TEST_ERROR")),
  };
}
