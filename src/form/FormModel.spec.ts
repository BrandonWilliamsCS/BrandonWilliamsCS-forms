import { validValidity } from "../value";
import { FormModel } from "./FormModel";

describe("FormModel", () => {
  describe("triggerSubmit", () => {
    it("causes emission of latest control value plus submitValue when value is valid", () => {
      // Arrange
      const formModel = new FormModel<string, string, any>();
      formModel.controlModel.onValueChange({
        value: "value1",
        validity: validValidity,
      });
      formModel.controlModel.onValueChange({
        value: "value2",
        validity: validValidity,
      });
      const submitListener = jest.fn();
      formModel.subscribe({ next: submitListener });
      // Act
      formModel.triggerSubmit("save");
      // Assert
      expect(submitListener).toHaveBeenCalledWith({
        value: "value2",
        submitValue: "save",
      });
    });
    it("does not cause emission when control value is invalid", () => {
      // Arrange
      const formModel = new FormModel<string, string, any>();
      formModel.controlModel.onValueChange({
        value: "value1",
        validity: {
          isValid: false,
          error: {
            variant: "field",
            errors: [{}],
          },
        },
      });
      const submitListener = jest.fn();
      formModel.subscribe({ next: submitListener });
      // Act
      formModel.triggerSubmit("save");
      // Assert
      expect(submitListener).not.toHaveBeenCalled();
    });
    it("does not cause emission when no control value is present", () => {
      // Arrange
      const formModel = new FormModel<string, string, any>();
      const submitListener = jest.fn();
      formModel.subscribe({ next: submitListener });
      // Act
      formModel.triggerSubmit("save");
      // Assert
      expect(submitListener).not.toHaveBeenCalled();
    });
  });
});
