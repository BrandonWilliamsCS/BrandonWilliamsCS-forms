import { Subject } from "rxjs";
import { validValidity } from "../Validity";
import { translateValueConsumer } from "./translateValueConsumer";

describe("translateValueConsumer", () => {
  describe("valueSource", () => {
    it("emits values mapped from sourceConsumer.valueSource", () => {
      // Arrange
      const sourceConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      const valueListener = jest.fn();
      // Act
      const translatedConsumer = translateValueConsumer(
        sourceConsumer,
        stringToNum,
        numToString,
      );
      translatedConsumer.valueSource.subscribe(valueListener);
      sourceConsumer.valueSource.next("5");
      // Assert
      expect(valueListener).toHaveBeenCalledWith(5);
    });
  });
  describe("onFormValueChange", () => {
    it("calls sourceConsumer.onFormValueChange with mapped FormValue value when given FormValue", () => {
      // Arrange
      const sourceConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      // Act
      const translatedConsumer = translateValueConsumer(
        sourceConsumer,
        stringToNum,
        numToString,
      );
      translatedConsumer.onFormValueChange({
        value: 5,
        validity: validValidity,
      });
      // Assert
      expect(sourceConsumer.onFormValueChange).toHaveBeenCalledWith({
        value: "5",
        validity: validValidity,
      });
    });
    it("calls sourceConsumer.onFormValueChange with mapped undefined when given undefined", () => {
      // Arrange
      const sourceConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      // Act
      const translatedConsumer = translateValueConsumer(
        sourceConsumer,
        stringToNum,
        numToString,
      );
      translatedConsumer.onFormValueChange(undefined);
      // Assert
      expect(sourceConsumer.onFormValueChange).toHaveBeenCalledWith(undefined);
    });
  });
});

const stringToNum = (s: string) => Number.parseFloat(s);
const numToString = (n: number) => n.toString();
