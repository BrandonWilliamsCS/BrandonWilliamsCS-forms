import { Subject } from "rxjs";
import { validityFor, validValidity } from "../Validity";
import { CollectiveFormValueConsumer } from "./CollectiveFormValueConsumer";

describe("CollectiveFormValueConsumer", () => {
  describe("getItemConsumer", () => {
    describe("returned FormValueAdapter", () => {
      describe("valueSource", () => {
        it("emits with item value when parent valueSource emits", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<Record<string, string>>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CollectiveFormValueConsumer<
            string,
            string
          >(parentConsumer);
          const valueListener = jest.fn();
          const incomingValue = { child1: "incoming value" };
          // Act
          const itemAdapter = compositeConsumer.getItemConsumer("child1");
          itemAdapter.valueSource.subscribe(valueListener);
          parentConsumer.valueSource.next(incomingValue);
          // Assert
          expect(valueListener).toHaveBeenCalledWith(incomingValue.child1);
        });
        it("does not emit when parent valueSource emits without item", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<Record<string, string>>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CollectiveFormValueConsumer<
            string,
            string
          >(parentConsumer);
          const valueListener = jest.fn();
          const incomingValue = {} as Record<string, string>;
          // Act
          const childAdapter = compositeConsumer.getItemConsumer("child1");
          childAdapter.valueSource.subscribe(valueListener);
          parentConsumer.valueSource.next(incomingValue);
          // Assert
          expect(valueListener).not.toHaveBeenCalled();
        });
      });
      describe("onFormValueChange", () => {
        it("calls parent onFormValueChange reflecting new item value", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<Record<string, string>>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CollectiveFormValueConsumer<
            string,
            string
          >(parentConsumer);
          const itemValue = "item value";
          // Act
          const itemAdapter = compositeConsumer.getItemConsumer("child1");
          itemAdapter.onFormValueChange({
            value: itemValue,
            validity: validityFor("item error"),
          });
          // Assert
          expect(parentConsumer.onFormValueChange).toHaveBeenCalledWith({
            value: { child1: itemValue },
            validity: validityFor({ child1: "item error" }),
          });
        });
        it("calls parent onFormValueChange without non-FormValue item", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<Record<string, string>>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CollectiveFormValueConsumer<
            string,
            string
          >(parentConsumer);
          // Act
          const itemAdapter = compositeConsumer.getItemConsumer("child1");
          itemAdapter.onFormValueChange(undefined);
          // Assert
          const latestParentFormValue =
            parentConsumer.onFormValueChange.mock.calls[0][0];
          expect("child1" in latestParentFormValue.value).toBe(false);
        });
      });
    });
  });
  describe("collective behavior", () => {
    it("calls parent onFormValueChange with valid, empty object when all item are non-FormValues", () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const compositeConsumer = new CollectiveFormValueConsumer<string, string>(
        parentConsumer,
      );
      // Act
      compositeConsumer.getItemConsumer("child1").onFormValueChange(undefined);
      compositeConsumer.getItemConsumer("child2").onFormValueChange(undefined);
      // Assert
      const latestParentFormValue =
        parentConsumer.onFormValueChange.mock.calls[1][0];
      expect(latestParentFormValue.value).toEqual({});
      expect(latestParentFormValue.validity).toEqual(validValidity);
    });
    it("calls parent onFormValueChange with established item values", () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const compositeConsumer = new CollectiveFormValueConsumer<string, string>(
        parentConsumer,
      );
      // Act
      compositeConsumer.getItemConsumer("child1").onFormValueChange({
        value: "child1 value",
        validity: validityFor("child1 error"),
      });
      compositeConsumer.getItemConsumer("child2").onFormValueChange({
        value: "child2 value",
        validity: validityFor("child2 error"),
      });
      // Assert
      const latestParentFormValue =
        parentConsumer.onFormValueChange.mock.calls[1][0];
      expect(latestParentFormValue).toEqual({
        value: { child1: "child1 value", child2: "child2 value" },
        validity: validityFor({
          child1: "child1 error",
          child2: "child2 error",
        }),
      });
    });
  });
});
