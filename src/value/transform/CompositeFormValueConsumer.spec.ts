import { Subject } from "rxjs";
import { validityFor, validValidity } from "../Validity";
import { CompositeFormValueConsumer } from "./CompositeFormValueConsumer";

describe("CompositeFormValueConsumer", () => {
  describe("getChildConsumer", () => {
    describe("returned FormValueAdapter", () => {
      describe("valueSource", () => {
        it("emits with child value when parent valueSource emits", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<TestGroup>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CompositeFormValueConsumer<
            TestGroup,
            string
          >(parentConsumer);
          const valueListener = jest.fn();
          const incomingValue = { text: "incoming value", count: 3 };
          // Act
          const childAdapter = compositeConsumer.getChildConsumer("text");
          childAdapter.valueSource.subscribe(valueListener);
          parentConsumer.valueSource.next(incomingValue);
          // Assert
          expect(valueListener).toHaveBeenCalledWith(incomingValue.text);
        });
        it("emits with undefined when parent valueSource emits without child", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<TestGroup>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CompositeFormValueConsumer<
            TestGroup,
            string
          >(parentConsumer);
          const valueListener = jest.fn();
          const incomingValue = {} as TestGroup;
          // Act
          const childAdapter = compositeConsumer.getChildConsumer("text");
          childAdapter.valueSource.subscribe(valueListener);
          parentConsumer.valueSource.next(incomingValue);
          // Assert
          expect(valueListener).toHaveBeenCalledWith(undefined);
        });
      });
      describe("onFormValueChange", () => {
        it("calls parent onFormValueChange reflecting new child value", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<TestGroup>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CompositeFormValueConsumer<
            TestGroup,
            string
          >(parentConsumer);
          const childValue = "child value";
          // Act
          const childAdapter = compositeConsumer.getChildConsumer("text");
          childAdapter.onFormValueChange({
            value: childValue,
            validity: validityFor("child error"),
          });
          // Assert
          expect(parentConsumer.onFormValueChange).toHaveBeenCalledWith({
            value: { text: childValue },
            validity: validityFor({ text: "child error" }),
          });
        });
        it("calls parent onFormValueChange without non-FormValue child", () => {
          // Arrange
          const parentConsumer = {
            valueSource: new Subject<TestGroup>(),
            onFormValueChange: jest.fn(),
          };
          const compositeConsumer = new CompositeFormValueConsumer<
            TestGroup,
            string
          >(parentConsumer);
          // Act
          const childAdapter = compositeConsumer.getChildConsumer("text");
          childAdapter.onFormValueChange(undefined);
          // Assert
          const latestParentFormValue =
            parentConsumer.onFormValueChange.mock.calls[0][0];
          expect("text" in latestParentFormValue.value).toBe(false);
        });
      });
    });
  });
  describe("composite behavior", () => {
    it("calls parent onFormValueChange with valid, empty object when all children are non-FormValues", () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<TestGroup>(),
        onFormValueChange: jest.fn(),
      };
      const compositeConsumer = new CompositeFormValueConsumer<
        TestGroup,
        string
      >(parentConsumer);
      // Act
      compositeConsumer.getChildConsumer("text").onFormValueChange(undefined);
      compositeConsumer.getChildConsumer("count").onFormValueChange(undefined);
      // Assert
      const latestParentFormValue =
        parentConsumer.onFormValueChange.mock.calls[1][0];
      expect(latestParentFormValue.value).toEqual({});
      expect(latestParentFormValue.validity).toEqual(validValidity);
    });
    it("calls parent onFormValueChange with established child values", () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<TestGroup>(),
        onFormValueChange: jest.fn(),
      };
      const compositeConsumer = new CompositeFormValueConsumer<
        TestGroup,
        string
      >(parentConsumer);
      // Act
      compositeConsumer.getChildConsumer("text").onFormValueChange({
        value: "text value",
        validity: validityFor("text error"),
      });
      compositeConsumer
        .getChildConsumer("count")
        .onFormValueChange({ value: 3, validity: validityFor("count error") });
      // Assert
      const latestParentFormValue =
        parentConsumer.onFormValueChange.mock.calls[1][0];
      expect(latestParentFormValue).toEqual({
        value: { text: "text value", count: 3 },
        validity: validityFor({ text: "text error", count: "count error" }),
      });
    });
  });
});

interface TestGroup {
  text: string;
  count: number;
}
