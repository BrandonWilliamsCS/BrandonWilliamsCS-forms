import { FormControlInterface } from "./FormControlInterface";
import {
  splitFormControl,
  ValueExtractor,
  ValueRecombiner,
} from "./splitFormControl";

// These tests will demonstrate a "virtual" parent/child relationship, as
// defined by the extract and recombine logic below. Instead of accessing
// directly by key, each child is a computed part of the parent name and a new
// full name can be computed based on the previous parent and the new part.
const extract: ValueExtractor<string, SplitName> = (
  fullName: string,
  key: keyof SplitName,
) => {
  const namePartIndex = key === "first" ? 0 : 1;
  const nameParts = fullName.split(" ");
  return nameParts[namePartIndex];
};
const recombine: ValueRecombiner<string, SplitName> = (
  prevFullName: string,
  nextChildValue: string,
  key: keyof SplitName,
) => {
  const namePartIndex = key === "first" ? 0 : 1;
  const nameParts = prevFullName.split(" ");
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
  });
});

interface SplitName {
  first: string;
  last: string;
}
