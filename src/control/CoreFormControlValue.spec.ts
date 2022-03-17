import { validValidity } from "../value";
import { CoreFormControlValue } from "./CoreFormControlValue";

describe("CoreFormControlValue", () => {
  describe("setValue", () => {
    it("produces a new FormValue", () => {
      // Arrange
      const formValueListener = jest.fn();
      const formControlValue = new CoreFormControlValue(
        requiredValidator,
        testValueEquals,
      );
      formControlValue.formValues.subscribe(formValueListener);
      // Act
      formControlValue.setValue({ id: 0 });
      // Assert
      const expectedValue = {
        value: { id: 0 },
        validity: validValidity,
      };
      expect(formControlValue.formValue).toEqual(expectedValue);
      expect(formValueListener).toHaveBeenCalledWith(expectedValue);
    });
    it("doesn't produce a new FormValue if base value hasn't changed", () => {
      // Arrange
      const formValueListener = jest.fn();
      const formControlValue = new CoreFormControlValue(
        requiredValidator,
        testValueEquals,
      );
      formControlValue.formValues.subscribe(formValueListener);
      // Act
      formControlValue.setValue({ id: 0 });
      formControlValue.setValue({ id: 0 });
      // Assert
      expect(formValueListener).toHaveBeenCalledTimes(1);
    });
    it("uses the latest validator to validate", () => {
      // Arrange
      const formValueListener = jest.fn();
      const formControlValue = new CoreFormControlValue(
        requiredValidator,
        testValueEquals,
      );
      formControlValue.formValues.subscribe(formValueListener);
      // Act
      formControlValue.setValidator(positiveIdValidator);
      formControlValue.setValue({ id: 0 });
      // Assert
      const expectedValue = {
        value: { id: 0 },
        validity: { isValid: false, error: ["positiveId"] },
      };
      expect(formControlValue.formValue).toEqual(expectedValue);
      expect(formValueListener).toHaveBeenCalledWith(expectedValue);
    });
  });
  describe("clearValue", () => {
    it("produces a new non-FormValue", () => {
      // Arrange
      const formValueListener = jest.fn();
      const formControlValue = new CoreFormControlValue(
        requiredValidator,
        testValueEquals,
      );
      formControlValue.formValues.subscribe(formValueListener);
      // Act
      formControlValue.setValue({ id: 0 });
      formControlValue.clearValue();
      // Assert
      expect(formValueListener).toHaveBeenCalledWith(undefined);
    });
    it("doesn't produce a new non-FormValue if there is no current FormValue", () => {
      // Arrange
      const formValueListener = jest.fn();
      const formControlValue = new CoreFormControlValue(
        requiredValidator,
        testValueEquals,
      );
      formControlValue.formValues.subscribe(formValueListener);
      // Act
      formControlValue.clearValue();
      // Assert
      expect(formValueListener).not.toHaveBeenCalledWith(undefined);
    });
  });
});

interface TestValue {
  id: number;
}

const testValueEquals = (a: TestValue, b: TestValue) => a.id === b.id;

const requiredValidator = (value: TestValue | undefined) =>
  value !== undefined ? undefined : ["required"];

const positiveIdValidator = (value: TestValue | undefined) =>
  !value || value.id > 0 ? undefined : ["positiveId"];
