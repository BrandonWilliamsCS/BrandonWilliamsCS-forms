import { KeyOrderDetector } from "./KeyOrderDetector";

describe("KeyOrderDetector", () => {
  describe("keyifyByReferenceValue", () => {
    it("generates keys for new values", () => {
      // Arrange
      const keyGen = buildKeyGen();
      const keyOrderDetector = new KeyOrderDetector(keyGen);
      const arrayValue = ["item0", "item1"];
      // Act
      const keyifiedValue = keyOrderDetector.keyifyByReferenceValue(arrayValue);
      // Assert
      expect(keyifiedValue).toEqual([
        ["0", "item0"],
        ["1", "item1"],
      ]);
    });
    it("is idempotent in terms of key generation", () => {
      // Arrange
      const keyGen = buildKeyGen();
      const keyOrderDetector = new KeyOrderDetector(keyGen);
      const arrayValue = ["item0"];
      // Act
      const keyifiedValue1 =
        keyOrderDetector.keyifyByReferenceValue(arrayValue);
      const keyifiedValue2 =
        keyOrderDetector.keyifyByReferenceValue(arrayValue);
      // Assert
      expect(keyifiedValue2).toEqual(keyifiedValue1);
    });
    it("handles duplicate values first-come-first-serve", () => {
      // Arrange
      const keyGen = buildKeyGen();
      const keyOrderDetector = new KeyOrderDetector(keyGen);
      const arrayValue = ["item", "item"];
      // Act
      const keyifiedValue = keyOrderDetector.keyifyByReferenceValue(arrayValue);
      // Assert
      expect(keyifiedValue).toEqual([
        ["0", "item"],
        ["1", "item"],
      ]);
    });
    it("recognizes changes to order for existing keys by reference value", () => {
      // Arrange
      const keyGen = buildKeyGen(2);
      const keyOrderDetector = new KeyOrderDetector(keyGen);
      keyOrderDetector.setReferenceValues({ "0": "item0", "1": "item1" });
      const arrayValue = ["item1", "item0"];
      // Act
      const keyifiedValue = keyOrderDetector.keyifyByReferenceValue(arrayValue);
      // Assert
      expect(keyifiedValue).toEqual([
        ["1", "item1"],
        ["0", "item0"],
      ]);
    });
    it("handles value changes as dropped and replaced keys", () => {
      // Arrange
      const keyGen = buildKeyGen(2);
      const keyOrderDetector = new KeyOrderDetector(keyGen);
      keyOrderDetector.setReferenceValues({ "0": "item0", "1": "item1" });
      const arrayValue = ["newItem0", "item1"];
      // Act
      const keyifiedValue = keyOrderDetector.keyifyByReferenceValue(arrayValue);
      // Assert
      expect(keyifiedValue).toEqual([
        ["2", "newItem0"],
        ["1", "item1"],
      ]);
    });
    it("uses the provided equality for value detection", () => {
      // Arrange
      const keyGen = buildKeyGen(1);
      const keyOrderDetector = new KeyOrderDetector(
        keyGen,
        (a: { id: number }, b: { id: number }) => a.id === b.id,
      );
      keyOrderDetector.setReferenceValues({ "0": { id: 0 } });
      const arrayValue = [{ id: 0 }];
      // Act
      const keyifiedValue = keyOrderDetector.keyifyByReferenceValue(arrayValue);
      // Assert
      expect(keyifiedValue).toEqual([["0", { id: 0 }]]);
    });
  });
});

function buildKeyGen(initialValue = 0) {
  let i = initialValue;
  return () => (i++).toString();
}
