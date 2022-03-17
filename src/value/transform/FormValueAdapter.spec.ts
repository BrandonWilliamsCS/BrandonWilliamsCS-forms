import { Subject } from "rxjs";
import { validValidity } from "../Validity";
import { FormValueAdapter } from "./FormValueAdapter";

describe("FormValueAdapter", () => {
  describe("valueSource", () => {
    it("emits everything baseConsumer.valueSource emits", () => {
      // Arrange
      const baseConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      const formModel = new FormValueAdapter(baseConsumer);
      const valueListener = jest.fn();
      formModel.valueSource.subscribe(valueListener);
      const incomingValue = "incoming value";
      // Act
      baseConsumer.valueSource.next(incomingValue);
      // Assert
      expect(valueListener).toHaveBeenCalledWith(incomingValue);
    });
  });
  describe("setValue", () => {
    it("emits value to valueSource", () => {
      // Arrange
      const baseConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      const formModel = new FormValueAdapter(baseConsumer);
      const valueListener = jest.fn();
      formModel.valueSource.subscribe(valueListener);
      const incomingValue = "incoming value";
      // Act
      formModel.setValue(incomingValue);
      // Assert
      expect(valueListener).toHaveBeenCalledWith(incomingValue);
    });
  });
  describe("onFormValueChange", () => {
    it("emits to formValues", () => {
      // Arrange
      const baseConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      const formModel = new FormValueAdapter(baseConsumer);
      const formValueListener = jest.fn();
      formModel.formValues.subscribe(formValueListener);
      const formValue = { value: "form value", validity: validValidity };
      // Act
      formModel.onFormValueChange(formValue);
      // Assert
      expect(formValueListener).toHaveBeenCalledWith(formValue);
    });
    it("calls baseConsumer.onFormValueChange", () => {
      // Arrange
      const baseConsumer = {
        valueSource: new Subject<string>(),
        onFormValueChange: jest.fn(),
      };
      const formModel = new FormValueAdapter(baseConsumer);
      const formValue = { value: "form value", validity: validValidity };
      // Act
      formModel.onFormValueChange(formValue);
      // Assert
      expect(baseConsumer.onFormValueChange).toHaveBeenCalledWith(formValue);
    });
  });
});
