import { Subject } from "rxjs";
import { validValidity } from "../Validity";
import { KeyOrderDetector } from "./KeyOrderDetector";
import { splitArrayFormValueConsumer } from "./splitArrayFormValueConsumer";

describe("splitArrayFormValueConsumer", () => {
  describe("return value", () => {
    describe("valueSource", () => {
      it("emits values mapped from sourceConsumer.valueSource", () => {
        // Arrange
        const sourceConsumer = {
          valueSource: new Subject<string[]>(),
          onFormValueChange: jest.fn(),
        };
        const initialValue: string[] = [];
        const keyOrderDetector = new KeyOrderDetector(buildKeyGen(3));
        keyOrderDetector.setReferenceValues({
          "0": "item0",
          "1": "item1",
          "2": "item2",
        });
        const splitConsumer = splitArrayFormValueConsumer(
          sourceConsumer,
          initialValue,
          keyOrderDetector,
        );
        const valueListener = jest.fn();
        splitConsumer.valueSource.subscribe(valueListener);
        // Act
        sourceConsumer.valueSource.next(["item2", "item3", "item1"]);
        // Assert
        expect(valueListener).toHaveBeenCalledWith({
          // items 1 and 2 remain, item 3 is added. Item 0 is irrelevant.
          "1": "item1",
          "2": "item2",
          "3": "item3",
        });
      });
    });
    describe("onFormValueChange", () => {
      it("calls parentConsumer.onFormValueChange with new FormValue ordered by latest key order", () => {
        // Arrange
        const sourceConsumer = {
          valueSource: new Subject<string[]>(),
          onFormValueChange: jest.fn(),
        };
        const initialValue: string[] = [];
        const keyOrderDetector = new KeyOrderDetector(buildKeyGen(3));
        const splitConsumer = splitArrayFormValueConsumer(
          sourceConsumer,
          initialValue,
          keyOrderDetector,
        );
        splitConsumer.onKeyOrderChange(["0", "2", "1"]);
        // Act
        splitConsumer.onFormValueChange({
          value: { "1": "item1", "2": "item2", "3": "item3" },
          validity: validValidity,
        });
        // Assert
        expect(sourceConsumer.onFormValueChange).toHaveBeenCalledWith({
          // 0 would be first, but has no value; 3 is not in the order.
          value: ["item2", "item1"],
          validity: validValidity,
        });
      });
    });
    describe("initialItems", () => {
      it("reflects the initialParentValue array with generated keys", () => {
        // Arrange
        const sourceConsumer = {
          valueSource: new Subject<string[]>(),
          onFormValueChange: jest.fn(),
        };
        const initialValue = ["item0", "item1", "item2"];
        const keyOrderDetector = new KeyOrderDetector(buildKeyGen());
        // Act
        const { initialItems } = splitArrayFormValueConsumer(
          sourceConsumer,
          initialValue,
          keyOrderDetector,
        );
        // Assert
        expect(initialItems).toEqual([
          { key: "0", value: "item0" },
          { key: "1", value: "item1" },
          { key: "2", value: "item2" },
        ]);
      });
    });
    describe("itemOrderSource", () => {
      it("emits item order detected from parentConsumer.valueSource", () => {
        // Arrange
        const sourceConsumer = {
          valueSource: new Subject<string[]>(),
          onFormValueChange: jest.fn(),
        };
        const initialValue: string[] = [];
        const keyOrderDetector = new KeyOrderDetector(buildKeyGen(3));
        keyOrderDetector.setReferenceValues({
          "0": "item0",
          "1": "item1",
          "2": "item2",
        });
        const splitConsumer = splitArrayFormValueConsumer(
          sourceConsumer,
          initialValue,
          keyOrderDetector,
        );
        const keyOrderListener = jest.fn();
        splitConsumer.itemOrderSource.subscribe(keyOrderListener);
        // Act
        sourceConsumer.valueSource.next(["item2", "item3", "item1"]);
        // Assert
        expect(keyOrderListener).toHaveBeenCalledWith([
          // items 1 and 2 remain in new order, item 3 is added. Item 0 is irrelevant.
          { key: "2", value: "item2" },
          { key: "3", value: "item3" },
          { key: "1", value: "item1" },
        ]);
      });
    });
    describe("onKeyOrderChange", () => {
      it("calls parentConsumer.onFormValueChange with latest FormValue ordered by new key order", () => {
        // Arrange
        const sourceConsumer = {
          valueSource: new Subject<string[]>(),
          onFormValueChange: jest.fn(),
        };
        const initialValue: string[] = [];
        const keyOrderDetector = new KeyOrderDetector(buildKeyGen(3));
        const splitConsumer = splitArrayFormValueConsumer(
          sourceConsumer,
          initialValue,
          keyOrderDetector,
        );
        splitConsumer.onFormValueChange({
          value: { "1": "item1", "2": "item2", "3": "item3" },
          validity: validValidity,
        });
        // Act
        splitConsumer.onKeyOrderChange(["0", "2", "1"]);
        // Assert
        expect(sourceConsumer.onFormValueChange).toHaveBeenCalledWith({
          // 0 would be first, but has no value; 3 is not in the order.
          value: ["item2", "item1"],
          validity: validValidity,
        });
      });
    });
  });
});

function buildKeyGen(initialValue = 0) {
  let i = initialValue;
  return () => (i++).toString();
}
