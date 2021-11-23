import { Subject } from "@blueharborsolutions/data-tools/observable";
import { FieldError, validityFor, validValidity } from "../value";
import { FormControlInterface } from "./FormControlInterface";
import { FormControlArray } from "./FormControlArray";

describe("FormControlArray", () => {
  describe("getChildInterface", () => {
    it("returns a child valueSource mapped by index from the parent", () => {
      // Arrange
      const parentSubject = new Subject<string[]>();
      const parentInterface: FormControlInterface<string[], any> = {
        valueSource: parentSubject,
        onValueChange: jest.fn(),
      };
      const formControlGroup = new FormControlArray(parentInterface);
      const childSourceNext = jest.fn();
      // Act
      const firstNameInterface = formControlGroup.getChildInterface(0);
      firstNameInterface.valueSource.subscribe({ next: childSourceNext });
      parentSubject.next(["value0", "value1"]);
      // Assert
      expect(childSourceNext).toHaveBeenCalledWith("value0");
    });
    it("returns a child onValueChange mapped by index to the parent", () => {
      // Arrange
      const parentInterface: FormControlInterface<string[], any> = {
        valueSource: new Subject<string[]>(),
        onValueChange: jest.fn(),
      };
      const formControlGroup = new FormControlArray(parentInterface);
      // Act
      const firstNameInterface = formControlGroup.getChildInterface(1);
      firstNameInterface.onValueChange({
        value: "value1",
        validity: validityFor(testFieldError("value is wrong")),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        // Note that first entry is MISSING (rather than present but set to `undefined`)
        value: [, "value1"],
        validity: validityFor({
          variant: "array",
          errors: [],
          innerErrors: [, testFieldError("value is wrong")],
        }),
      });
    });
    it("accumulates onValueChange calls from child functions", () => {
      // Arrange
      const parentSubject = new Subject<string[]>();
      const parentInterface: FormControlInterface<string[], any> = {
        valueSource: parentSubject,
        onValueChange: jest.fn(),
      };
      // Act
      const formControlGroup = new FormControlArray(parentInterface);
      const firstNameInterface = formControlGroup.getChildInterface(0);
      firstNameInterface.onValueChange({
        value: "value0",
        validity: validityFor(testFieldError("value is wrong")),
      });
      const lastNameInterface = formControlGroup.getChildInterface(1);
      lastNameInterface.onValueChange({
        value: "value1",
        validity: validValidity,
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: ["value0", "value1"],
        validity: validityFor({
          variant: "array",
          errors: [],
          innerErrors: [testFieldError("value is wrong")],
        }),
      });
    });
  });
});

function testFieldError(type: string): FieldError<any> {
  return {
    variant: "field",
    errors: [{ type, requiresConfirmation: false }],
  };
}
