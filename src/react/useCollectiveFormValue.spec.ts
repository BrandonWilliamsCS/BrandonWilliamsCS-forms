import { renderHook } from "@testing-library/react-hooks";
import { Subject } from "rxjs";
import { validValidity } from "../value";
import { useCollectiveFormValue } from "./useCollectiveFormValue";

describe("useCollectiveFormValue", () => {
  describe("returned collectiveConsumer", () => {
    it("emits child source value when parent source value is emitted", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = {
        "0": "item0",
      };
      const newParentValue = {
        "0": "item0-changed",
      };
      const childValueChangeListener = jest.fn();
      // Act
      const { result } = renderHook(() =>
        useCollectiveFormValue<string, string>(
          parentConsumer,
          initialParentValue,
        ),
      );
      result.current.collectiveConsumer
        .getItemConsumer("0")
        .valueSource.subscribe(childValueChangeListener);
      parentConsumer.valueSource.next(newParentValue);
      // Assert
      expect(childValueChangeListener).toHaveBeenCalledWith("item0-changed");
    });
    it("calls parent consumer onFormValueChange when a child FormValue is reported", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = {
        "0": "item0",
      };
      const newChildFormValue = {
        value: "item0-changed",
        validity: validValidity,
      };
      // Act
      const { result } = renderHook(() =>
        useCollectiveFormValue<string, string>(
          parentConsumer,
          initialParentValue,
        ),
      );
      result.current.collectiveConsumer
        .getItemConsumer("0")
        .onFormValueChange(newChildFormValue);
      // Assert
      expect(parentConsumer.onFormValueChange).toHaveBeenCalledWith({
        value: { "0": "item0-changed" },
        validity: validValidity,
      });
    });
  });
  describe("returned compositionModel", () => {
    it("has initial composition reflecting initialParentValue", async () => {
      // Arrange
      const parentConsumer = {
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = {
        "0": "item0",
        "1": "item1",
      };
      // Act
      const { result } = renderHook(() =>
        useCollectiveFormValue<string, string>(
          parentConsumer,
          initialParentValue,
        ),
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
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = {
        "0": "item0",
        "1": "item1",
      };
      const changeEventListener = jest.fn();
      const nextValue = {
        "1": "item1",
        "2": "item2",
      };
      // Act
      const { result } = renderHook(() =>
        useCollectiveFormValue<string, string>(
          parentConsumer,
          initialParentValue,
        ),
      );
      result.current.compositionModel.changes.subscribe(changeEventListener);
      parentConsumer.valueSource.next(nextValue);
      // Assert
      expect(changeEventListener).toHaveBeenCalledWith({
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
        valueSource: new Subject<Record<string, string>>(),
        onFormValueChange: jest.fn(),
      };
      const initialParentValue = {
        "0": "item0",
        "1": "item1",
      };
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
        useCollectiveFormValue<string, string>(
          parentConsumer,
          initialParentValue,
        ),
      );
      result.current.collectiveConsumer
        .getItemConsumer("0")
        .onFormValueChange(childFormValues[0]);
      result.current.collectiveConsumer
        .getItemConsumer("1")
        .onFormValueChange(childFormValues[1]);
      result.current.compositionModel.removeItem(droppedKey);
      // Assert
      expect(parentConsumer.onFormValueChange).toHaveBeenCalledWith({
        value: { "0": "item0" },
        validity: validValidity,
      });
    });
  });
});
