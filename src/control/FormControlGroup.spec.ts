import { Subject } from "@blueharborsolutions/data-tools/observable";
import { FieldError, validityFor, validValidity } from "../value";
import { FormControlInterface } from "./FormControlInterface";
import { FormControlGroup } from "./FormControlGroup";

describe("FormControlGroup", () => {
  describe("getChildInterface", () => {
    it("returns a child valueSource mapped by key from the parent", () => {
      // Arrange
      const parentSubject = new Subject<Name>();
      const parentInterface: FormControlInterface<Name, any> = {
        valueSource: parentSubject,
        onValueChange: jest.fn(),
      };
      const formControlGroup = new FormControlGroup(parentInterface);
      const childSourceNext = jest.fn();
      // Act
      const firstNameInterface = formControlGroup.getChildInterface("first");
      firstNameInterface.valueSource.subscribe({ next: childSourceNext });
      parentSubject.next({
        first: "Firsty",
        last: "Lastson",
      });
      // Assert
      expect(childSourceNext).toHaveBeenCalledWith("Firsty");
    });
    it("returns a child onValueChange mapped by key to the parent", () => {
      // Arrange
      const parentInterface: FormControlInterface<Partial<Name>, any> = {
        valueSource: new Subject<Name>(),
        onValueChange: jest.fn(),
      };
      const formControlGroup = new FormControlGroup(parentInterface);
      // Act
      const firstNameInterface = formControlGroup.getChildInterface("first");
      firstNameInterface.onValueChange({
        value: "Firsty",
        validity: validityFor(testFieldError("First name is wrong")),
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: {
          first: "Firsty",
        },
        validity: validityFor({
          variant: "group",
          errors: [],
          innerErrors: {
            first: testFieldError("First name is wrong"),
          },
        }),
      });
    });
    it("accumulates onValueChange calls from child functions", () => {
      // Arrange
      const parentSubject = new Subject<Name>();
      const parentInterface: FormControlInterface<Partial<Name>, any> = {
        valueSource: parentSubject,
        onValueChange: jest.fn(),
      };
      // Act
      const formControlGroup = new FormControlGroup(parentInterface);
      const firstNameInterface = formControlGroup.getChildInterface("first");
      firstNameInterface.onValueChange({
        value: "Firsty",
        validity: validityFor(testFieldError("First name is wrong")),
      });
      const lastNameInterface = formControlGroup.getChildInterface("last");
      lastNameInterface.onValueChange({
        value: "Lastson",
        validity: validValidity,
      });
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith({
        value: {
          first: "Firsty",
          last: "Lastson",
        },
        validity: validityFor({
          variant: "group",
          errors: [],
          innerErrors: {
            first: testFieldError("First name is wrong"),
          },
        }),
      });
    });
  });
});

interface Name {
  first: string;
  last: string;
}

function testFieldError(type: string): FieldError<any> {
  return {
    variant: "field",
    errors: [{ type, requiresConfirmation: false }],
  };
}
