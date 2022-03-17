import { act, renderHook } from "@testing-library/react-hooks";
import { Subject } from "rxjs";
import { validValidity } from "../value";
import { useArrayFormValue } from "./useArrayFormValue";

describe("useArrayFormValue", () => {
  describe("returned collectiveConsumer", () => {
    it("emits child source values when parent source value is emitted (treating changes as new values)", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<string[]>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = ["item0", "item1"];
      const newParentValue = ["item0-changed", "item1"];
      const child0ValueChangeListener = jest.fn();
      const child1ValueChangeListener = jest.fn();
      const child2ValueChangeListener = jest.fn();
      // Act
      const { result } = renderHook(() =>
        useArrayFormValue<string, string>(parentConsumer, initialParentValue),
      );
      act(() => {
        // Make sure the child consumers exist and their FormValues have been confirmed.
        const collectiveConsumer = result.current.collectiveConsumer;
        const consumer0 = collectiveConsumer.getItemConsumer("0");
        const consumer1 = collectiveConsumer.getItemConsumer("1");
        const consumer2 = collectiveConsumer.getItemConsumer("3");
        consumer0.onFormValueChange(itemFormValueFor(initialParentValue["0"]));
        consumer1.onFormValueChange(itemFormValueFor(initialParentValue["1"]));
      });
      act(() => {
        const collectiveConsumer = result.current.collectiveConsumer;
        collectiveConsumer
          .getItemConsumer("0")
          .valueSource.subscribe(child0ValueChangeListener);
        collectiveConsumer
          .getItemConsumer("1")
          .valueSource.subscribe(child1ValueChangeListener);
        collectiveConsumer
          .getItemConsumer("2")
          .valueSource.subscribe(child2ValueChangeListener);
        parentConsumer.valueSource.next(newParentValue);
      });
      // Assert
      expect(child0ValueChangeListener).not.toHaveBeenCalled();
      expect(child1ValueChangeListener).toHaveBeenLastCalledWith("item1");
      expect(child2ValueChangeListener).toHaveBeenLastCalledWith(
        "item0-changed",
      );
    });
    it("calls parent consumer onFormValueChange when a child FormValue is reported", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<string[]>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = ["item0"];
      const newChildFormValue = {
        value: "item0-changed",
        validity: validValidity,
      };
      // Act
      const { result } = renderHook(() =>
        useArrayFormValue<string, string>(parentConsumer, initialParentValue),
      );
      act(() => {
        const itemConsumer =
          result.current.collectiveConsumer.getItemConsumer("0");
        itemConsumer.onFormValueChange(
          itemFormValueFor(initialParentValue["0"]),
        );
        itemConsumer.onFormValueChange(newChildFormValue);
      });
      // Assert
      expect(parentConsumer.onFormValueChange).toHaveBeenLastCalledWith({
        value: ["item0-changed"],
        validity: validValidity,
      });
    });
  });
  describe("returned compositionModel", () => {
    it("has initial composition reflecting initialParentValue", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<string[]>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = ["item0", "item1"];
      // Act
      const { result } = renderHook(() =>
        useArrayFormValue<string, string>(parentConsumer, initialParentValue),
      );
      // Assert
      expect(result.current.compositionModel.composition).toEqual([
        { key: "0", value: "item0" },
        { key: "1", value: "item1" },
      ]);
    });
    it("emits changes upon new parent value", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<string[]>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = ["item0", "item1"];
      const changeEventListener = jest.fn();
      const nextValue = ["item1", "item2"];
      // Act
      const { result } = renderHook(() =>
        useArrayFormValue<string, string>(parentConsumer, initialParentValue),
      );
      act(() => {
        result.current.collectiveConsumer
          .getItemConsumer("0")
          .onFormValueChange(itemFormValueFor(initialParentValue["0"]));
        result.current.collectiveConsumer
          .getItemConsumer("1")
          .onFormValueChange(itemFormValueFor(initialParentValue["1"]));
        result.current.compositionModel.changes.subscribe(changeEventListener);
        parentConsumer.valueSource.next(nextValue);
      });
      // Assert
      expect(changeEventListener).toHaveBeenLastCalledWith({
        newComposition: [
          { key: "1", value: "item1" },
          { key: "2", value: "item2" },
        ],
        droppedKeys: ["0"],
      });
    });
    it("triggers parent FormValue without child when child is dropped", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<string[]>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = ["item0", "item1"];
      const childFormValues = [
        {
          value: "item0",
          validity: validValidity,
        },
        {
          value: "item1",
          validity: validValidity,
        },
      ];
      const droppedKey = "0";
      // Act
      const { result } = renderHook(() =>
        useArrayFormValue<string, string>(parentConsumer, initialParentValue),
      );
      act(() => {
        result.current.collectiveConsumer
          .getItemConsumer("0")
          .onFormValueChange(childFormValues[0]);
        result.current.collectiveConsumer
          .getItemConsumer("1")
          .onFormValueChange(childFormValues[1]);
        result.current.compositionModel.removeItem(droppedKey);
      });
      // Assert
      expect(parentConsumer.onFormValueChange).toHaveBeenLastCalledWith({
        value: ["item1"],
        validity: validValidity,
      });
    });
  });
});

function itemFormValueFor(value: string) {
  return { value, validity: validValidity };
}
