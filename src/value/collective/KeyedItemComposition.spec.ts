import { KeyedItemComposition } from "./KeyedItemComposition";

describe("KeyedItemComposition", () => {
  describe("composition", () => {
    it("is initially set to the provided initialComposition", () => {
      // Arrange
      const initialComposition = [{ key: "key1", value: "value1" }];
      // Act
      const keyedItemComposition = new KeyedItemComposition(initialComposition);
      // Assert
      expect(keyedItemComposition.composition).toEqual(initialComposition);
    });
  });
  describe("setItems", () => {
    it("updates composition to new composition", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const newComposition = [{ key: "key1", value: "value1" }];
      const compositionListener = jest.fn();
      keyedItemComposition.compositions.subscribe(compositionListener);
      // Act
      keyedItemComposition.setItems(newComposition);
      // Assert
      expect(keyedItemComposition.composition).toEqual(newComposition);
      expect(compositionListener).toHaveBeenCalledWith(newComposition);
    });
    it("triggers change emission with new composition", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const newComposition = [{ key: "key1", value: "value1" }];
      const changeListener = jest.fn();
      keyedItemComposition.changes.subscribe(changeListener);
      // Act
      keyedItemComposition.setItems(newComposition);
      // Assert
      expect(changeListener).toHaveBeenCalledWith({
        newComposition,
        droppedKeys: [],
      });
    });
    it("triggers change emission with droppedKeys", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const initialComposition = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
      ];
      keyedItemComposition.setItems(initialComposition);
      const newComposition = [{ key: "key1", value: "value1" }];
      const changeListener = jest.fn();
      keyedItemComposition.changes.subscribe(changeListener);
      // Act
      keyedItemComposition.setItems(newComposition);
      // Assert
      expect(changeListener).toHaveBeenCalledWith({
        newComposition,
        droppedKeys: ["key2"],
      });
    });
    it("does nothing when composition doesn't change", () => {
      // Arrange
      const initialComposition = [{ key: "key1", value: "value1" }];
      const keyedItemComposition = new KeyedItemComposition(initialComposition);
      const newComposition = [{ key: "key1", value: "value1" }];
      const compositionListener = jest.fn();
      keyedItemComposition.compositions.subscribe(compositionListener);
      // Act
      keyedItemComposition.setItems(newComposition);
      // Assert
      expect(keyedItemComposition.composition).toEqual(newComposition);
      expect(compositionListener).not.toHaveBeenCalled();
    });
  });
  describe("appendItem", () => {
    it("updates composition to new composition", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const newItem = { key: "key1", value: "value1" };
      const compositionListener = jest.fn();
      keyedItemComposition.compositions.subscribe(compositionListener);
      // Act
      keyedItemComposition.appendItem(newItem.key, newItem.value);
      // Assert
      expect(keyedItemComposition.composition).toEqual([newItem]);
      expect(compositionListener).toHaveBeenCalledWith([newItem]);
    });
    it("triggers change emission with new composition", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const newItem = { key: "key1", value: "value1" };
      const changeListener = jest.fn();
      keyedItemComposition.changes.subscribe(changeListener);
      // Act
      keyedItemComposition.appendItem(newItem.key, newItem.value);
      // Assert
      expect(changeListener).toHaveBeenCalledWith({
        newComposition: [newItem],
        droppedKeys: [],
      });
    });
  });
  describe("removeItem", () => {
    it("updates composition to new composition", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const initialComposition = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
      ];
      keyedItemComposition.setItems(initialComposition);
      const removedKey = "key1";
      const compositionListener = jest.fn();
      keyedItemComposition.compositions.subscribe(compositionListener);
      // Act
      keyedItemComposition.removeItem(removedKey);
      // Assert
      expect(keyedItemComposition.composition).toEqual([initialComposition[1]]);
      expect(compositionListener).toHaveBeenCalledWith([initialComposition[1]]);
    });
    it("triggers change emission with new composition", () => {
      // Arrange
      const keyedItemComposition = new KeyedItemComposition();
      const initialComposition = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
      ];
      keyedItemComposition.setItems(initialComposition);
      const removedKey = "key1";
      const changeListener = jest.fn();
      keyedItemComposition.changes.subscribe(changeListener);
      // Act
      keyedItemComposition.removeItem(removedKey);
      // Assert
      expect(changeListener).toHaveBeenCalledWith({
        newComposition: [initialComposition[1]],
        droppedKeys: [removedKey],
      });
    });
  });
});
