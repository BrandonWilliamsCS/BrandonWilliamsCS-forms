import { validValidity } from "../value";
import { FormModel } from "./FormModel";

describe("FormModel", () => {
  describe("formValue", () => {
    it("reflects latest FormValue sent to the FormValueAdapter", () => {
      // Arrange
      const formValue = {
        value: 2,
        validity: validValidity,
      };
      const formModel = new FormModel<number, string | undefined, string>();
      // Act
      formModel.valueAdapter.onFormValueChange(formValue);
      // Assert
      expect(formModel.formValue).toEqual(formValue);
    });
  });
  describe("triggerSubmit", () => {
    it("produces a new non-FormValue", () => {
      // Arrange
      const submitListener = jest.fn();
      const formValue = {
        value: 2,
        validity: validValidity,
      };
      const formModel = new FormModel<number, string | undefined, string>();
      formModel.submits.subscribe(submitListener);
      formModel.valueAdapter.onFormValueChange(formValue);
      // Act
      formModel.triggerSubmit("save");
      // Assert
      expect(submitListener).toHaveBeenCalledWith({
        value: formValue,
        submitValue: "save",
      });
    });
    it("fails if there is no FormValue", () => {
      // Arrange
      const submitListener = jest.fn();
      const submitErrorListener = jest.fn();
      const formModel = new FormModel<number, string | undefined, string>();
      formModel.submits.subscribe({
        next: submitListener,
        error: submitErrorListener,
      });
      // Act
      formModel.triggerSubmit("save");
      // Assert
      expect(submitListener).not.toHaveBeenCalled();
      expect(submitErrorListener).toHaveBeenCalledWith(
        new Error("Cannot submit form with no value"),
      );
    });
  });
});
