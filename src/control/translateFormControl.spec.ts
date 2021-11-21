import { Subject } from "@blueharborsolutions/data-tools/observable";

import { Handler, HandlerInterceptor } from "../utility";
import { FormValue } from "../value/FormValue";
import { validValidity } from "../value/Validity";
import { FormControlInterface } from "./FormControlInterface";
import { translateFormControl } from "./translateFormControl";

const mapper = (n: number) => n.toString();
const changeInterceptor: HandlerInterceptor<
  FormValue<string, any>,
  FormValue<number, any>
> = (formValue, base) => {
  const parsedValue = formValue.value
    ? Number.parseInt(formValue.value, 10)
    : Number.NaN;
  // Don't report non-numbers.
  if (!Number.isNaN(parsedValue)) {
    base({ value: parsedValue, validity: formValue.validity });
  }
};

describe("translateFormControl", () => {
  describe("returned value", () => {
    it("has a source of mapped values", async () => {
      // Arrange
      const sourceValueSource = new Subject<number>();
      const sourceInterface: FormControlInterface<number, any> = {
        valueSource: sourceValueSource,
        onValueChange: jest.fn(),
      };
      const translatedInterface = translateFormControl(
        sourceInterface,
        mapper,
        changeInterceptor,
      );
      const translatedInterfaceSubscriber = { next: jest.fn() };
      translatedInterface.valueSource.subscribe(translatedInterfaceSubscriber);
      // Act
      sourceValueSource.next(1);
      // Assert
      expect(translatedInterfaceSubscriber.next).toHaveBeenCalledWith("1");
    });
    it("calls the source onValueChange with a re-mapped value when onValueChange is called", async () => {
      // Arrange
      const sourceValueSource = new Subject<number>();
      const sourceInterface: FormControlInterface<number, any> = {
        valueSource: sourceValueSource,
        onValueChange: jest.fn(),
      };
      const translatedInterface = translateFormControl(
        sourceInterface,
        mapper,
        changeInterceptor,
      );
      // Act
      translatedInterface.onValueChange({
        value: "1",
        validity: validValidity,
      });
      // Assert
      expect(sourceInterface.onValueChange).toHaveBeenCalledWith({
        value: 1,
        validity: validValidity,
      });
    });
    it("Doesn't call the source onValueChange if the change is intercepted", async () => {
      // Arrange
      const sourceValueSource = new Subject<number>();
      const sourceInterface: FormControlInterface<number, any> = {
        valueSource: sourceValueSource,
        onValueChange: jest.fn(),
      };
      const translatedInterface = translateFormControl(
        sourceInterface,
        mapper,
        changeInterceptor,
      );
      // Act
      translatedInterface.onValueChange({
        value: "Not a number!",
        validity: validValidity,
      });
      // Assert
      expect(sourceInterface.onValueChange).not.toHaveBeenCalled();
    });
  });
});
