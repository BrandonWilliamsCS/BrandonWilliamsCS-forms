import { FormControlInterface } from "./FormControlInterface";
import {
  splitFormControl,
  ValueExtractor,
  ValueRecombiner,
} from "./splitFormControl";

// These tests demonstrate a "virtual" parent/child relationship, as
// defined by the extract and recombine logic below. Instead of accessing
// directly by key, each child is a computed part of the parent name and a new
// full name can be computed based on the previous parent and the new part.
const extract: ValueExtractor<string, SplitName> = (
  fullName: string | undefined,
  key: keyof SplitName,
) => {
  if (fullName === undefined) {
    return undefined;
  }
  const namePartIndex = key === "first" ? 0 : 1;
  const nameParts = fullName.split(" ");
  return nameParts[namePartIndex];
};
const recombine: ValueRecombiner<string, SplitName> = (
  prevFullName: string | undefined,
  nextChildValue: string,
  key: keyof SplitName,
) => {
  const namePartIndex = key === "first" ? 0 : 1;
  const nameParts = prevFullName ? prevFullName.split(" ") : [];
  nameParts[namePartIndex] = nextChildValue;
  return nameParts.join(" ");
};

describe("splitFormControl", () => {
  describe("returned interface", () => {
    it("returns the child value for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<string> = {
        value: "Firsty Lastson",
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitFormControl<string, SplitName>(
        parentInterface,
        extract,
        recombine,
      );
      const firstNameInterface = compositeInterface("first");
      // Assert
      expect(firstNameInterface.value).toBe("Firsty");
    });
    it("returns a default child value for an undefined parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<string> = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitFormControl<string, SplitName>(
        parentInterface,
        extract,
        recombine,
      );
      const firstNameInterface = compositeInterface("first");
      // Assert
      expect(firstNameInterface.value).toBeUndefined();
    });
    it("returns a child onValueChange for the given key within the parent interface", () => {
      // Arrange
      const parentInterface: FormControlInterface<string> = {
        value: "Firsty Lastson",
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitFormControl<string, SplitName>(
        parentInterface,
        extract,
        recombine,
      );
      const firstNameInterface = compositeInterface("first");
      firstNameInterface.onValueChange("Secondy");
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith(
        "Secondy Lastson",
      );
    });
    it("returns a child-only onValueChange for the given key when there is no parent value", () => {
      // Arrange
      const parentInterface: FormControlInterface<string> = {
        value: undefined,
        onValueChange: jest.fn(),
      };
      // Act
      const compositeInterface = splitFormControl<string, SplitName>(
        parentInterface,
        extract,
        recombine,
      );
      const firstNameInterface = compositeInterface("first");
      firstNameInterface.onValueChange("Secondy");
      // Assert
      expect(parentInterface.onValueChange).toHaveBeenCalledWith("Secondy");
    });
  });
});

interface SplitName {
  first: string;
  last: string;
}
