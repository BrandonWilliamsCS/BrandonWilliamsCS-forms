import React from "react";
import {
  useStableValue,
  useVolatileValue,
} from "@blueharborsolutions/react-data-tools";

import { FormValueConsumer } from "../value";
import { translateValueConsumer } from "../value/transform";
import { useCollectiveFormValue } from "./useCollectiveFormValue";

export function useArrayFormValue<T, E>(
  parentConsumer: FormValueConsumer<T[], Record<string, E>>,
  keyAccessor: (itemValue: T, i: number) => string,
  initialParentValue: T[],
) {
  const volatileKeyAccessor = useVolatileValue(keyAccessor);
  const keyOrderingRef = React.useRef<string[]>([]);
  const translatedConsumer = useStableValue(
    () =>
      translateValueConsumer(
        parentConsumer,
        (array) => arrayToObject(array, volatileKeyAccessor.current),
        (object) =>
          keyOrderingRef.current
            .filter((key) => key in object)
            .map((key) => object[key]),
      ),
    [parentConsumer],
  );
  const { collectiveConsumer, currentItems, addItem, removeItem } =
    useCollectiveFormValue(
      translatedConsumer,
      arrayToObject(initialParentValue, keyAccessor),
    );
  keyOrderingRef.current = currentItems.map((item) => item.key);
  return {
    collectiveConsumer,
    currentItems,
    addItem: (itemValue: T) => {
      addItem(keyAccessor(itemValue, currentItems.length), itemValue);
    },
    removeItem,
  };
}

function arrayToObject<T>(
  array: T[],
  keyAccessor: (itemValue: T, i: number) => string,
): Record<string, T> {
  const object: Record<string, T> = {};
  array.forEach((itemValue, i) => {
    const key = keyAccessor(itemValue, i);
    object[key] = itemValue;
  });
  return object;
}
