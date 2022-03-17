import { renderHook } from "@testing-library/react-hooks";
import { identity } from "lodash";
import { Subject } from "rxjs";
import { ChildItem, useKeyedItemComposition } from "./useKeyedItemComposition";

describe("useKeyedItemComposition", () => {
  it("calls composition change callback with initial composition", async () => {
    // Arrange
    const parentValues = new Subject<ChildItem<string>[]>();
    const initialValue = [
      { key: "0", value: "item0" },
      { key: "1", value: "item1" },
      { key: "2", value: "item2" },
    ];
    const handleCompositionChange = jest.fn();
    // Act
    const {} = renderHook(() =>
      useKeyedItemComposition<string, ChildItem<string>[]>(
        parentValues,
        initialValue,
        handleCompositionChange,
        identity,
      ),
    );
    // Assert
    expect(handleCompositionChange).toHaveBeenLastCalledWith({
      newComposition: [
        { key: "0", value: "item0" },
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
      ],
      droppedKeys: [],
    });
  });
  describe("returned compositionModel", () => {
    it("has initial composition reflecting initialParentValue", async () => {
      // Arrange
      const parentValues = new Subject<ChildItem<string>[]>();
      const initialValue = [
        { key: "0", value: "item0" },
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
      ];
      const handleCompositionChange = jest.fn();
      // Act
      const { result } = renderHook(() =>
        useKeyedItemComposition<string, ChildItem<string>[]>(
          parentValues,
          initialValue,
          handleCompositionChange,
          identity,
        ),
      );
      // Assert
      expect(result.current.composition).toEqual([
        { key: "0", value: "item0" },
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
      ]);
    });
    it("emits changes upon new parent value", async () => {
      // Arrange
      const parentValues = new Subject<ChildItem<string>[]>();
      const initialValue = [
        { key: "0", value: "item0" },
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
      ];
      const handleCompositionChange = jest.fn();
      const changeEventListener = jest.fn();

      const nextValue = [
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
        { key: "3", value: "item3" },
      ];
      // Act
      const { result } = renderHook(() =>
        useKeyedItemComposition<string, ChildItem<string>[]>(
          parentValues,
          initialValue,
          handleCompositionChange,
          identity,
        ),
      );
      result.current.changes.subscribe(changeEventListener);
      parentValues.next(nextValue);
      // Assert
      expect(changeEventListener).toHaveBeenLastCalledWith({
        newComposition: [
          { key: "1", value: "item1" },
          { key: "2", value: "item2" },
          { key: "3", value: "item3" },
        ],
        droppedKeys: ["0"],
      });
    });
    it("triggers composition change callback when items are set", async () => {
      // Arrange
      const parentValues = new Subject<ChildItem<string>[]>();
      const initialValue = [
        { key: "0", value: "item0" },
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
      ];
      const handleCompositionChange = jest.fn();
      const nextValue = [
        { key: "1", value: "item1" },
        { key: "2", value: "item2" },
        { key: "3", value: "item3" },
      ];
      // Act
      const { result } = renderHook(() =>
        useKeyedItemComposition<string, ChildItem<string>[]>(
          parentValues,
          initialValue,
          handleCompositionChange,
          identity,
        ),
      );
      result.current.setItems(nextValue);
      // Assert
      expect(handleCompositionChange).toHaveBeenLastCalledWith({
        newComposition: [
          { key: "1", value: "item1" },
          { key: "2", value: "item2" },
          { key: "3", value: "item3" },
        ],
        droppedKeys: ["0"],
      });
    });
    it("uses custom value incorporation logic", async () => {
      // Arrange
      const parentValues = new Subject<string[]>();
      const initialValue = ["item0", "item1", "item2"];
      const handleCompositionChange = jest.fn();
      const incorporateParentValues = (
        incoming: string[],
        existing: ChildItem<string>[],
      ) => existing.concat(incoming.map((value) => ({ key: value, value })));
      // Act
      const { result } = renderHook(() =>
        useKeyedItemComposition<string, string[]>(
          parentValues,
          initialValue,
          handleCompositionChange,
          incorporateParentValues,
        ),
      );
      // Assert
      expect(result.current.composition).toEqual([
        { key: "item0", value: "item0" },
        { key: "item1", value: "item1" },
        { key: "item2", value: "item2" },
      ]);
    });
  });
});
