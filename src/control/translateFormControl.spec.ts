import { Subject } from "@blueharborsolutions/data-tools/observable";

import { validValidity } from "../value/Validity";
import { FormControlInterface } from "./FormControlInterface";
import { translateFormControl } from "./translateFormControl";

const sourceToTarget = (n: number) => n.toString();
const targetToSource = (str: string) =>
  str ? Number.parseInt(str, 10) : Number.NaN;

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
        sourceToTarget,
        targetToSource,
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
        sourceToTarget,
        targetToSource,
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
  });
});
