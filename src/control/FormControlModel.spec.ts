import { validValidity } from "../value";
import { FormControlModel } from "./FormControlModel";

describe("FormControlModel", () => {
  describe("setValue", () => {
    it("emits values to the model's valueSource", () => {
      // Arrange
      const formControlModel = new FormControlModel<string, any>();
      const valueSourceListener = jest.fn();
      formControlModel.valueSource.subscribe({ next: valueSourceListener });
      // Act
      formControlModel.setValue("value");
      // Assert
      expect(valueSourceListener).toHaveBeenCalledWith("value");
    });
  });
  describe("onValueChange", () => {
    it("emits values to the model's subscribers", () => {
      // Arrange
      const formControlModel = new FormControlModel<string, any>();
      const formValueListener = jest.fn();
      formControlModel.subscribe({ next: formValueListener });
      // Act
      formControlModel.onValueChange({
        value: "value",
        validity: validValidity,
      });
      // Assert
      expect(formValueListener).toHaveBeenCalledWith({
        value: "value",
        validity: validValidity,
      });
    });
  });
});
