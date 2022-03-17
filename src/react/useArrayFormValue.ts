import {
  useStableValue,
  useSubscribableValue,
} from "@blueharborsolutions/react-data-tools";
import React from "react";

import { FormValueConsumer } from "../value";
import { KeyOrderDetector } from "../value/array/KeyOrderDetector";
import { splitArrayFormValueConsumer } from "../value/array/splitArrayFormValueConsumer";
import { CollectiveFormValueConsumer } from "../value/collective/CollectiveFormValueConsumer";
import { ChildItem, useKeyedItemComposition } from "./useKeyedItemComposition";
import { identity } from "lodash";

/**
 * Divides an array-valued FormValueConsumer into a combination of its children
 * and the overall composition of values by key.
 * @param parentConsumer The consumer of the parent array values
 * @param initialParentValue The initial parent array value to use
 * @returns objects representing the collection of child value consumers, the
 * composition, and how to generate a key for new items.
 * @remarks
 * The composition pairs the currently expected set of keys with their initial
 * values.
 */
export function useArrayFormValue<T, E>(
  parentConsumer: FormValueConsumer<T[], E[]>,
  initialParentValue: T[],
) {
  const keyGen = useCountingKeygen();
  const {
    collectiveConsumer,
    initialItems,
    itemOrderSource,
    onKeyOrderChange,
  } = useSplitArrayFormValueConsumer(
    parentConsumer,
    initialParentValue,
    keyGen,
  );

  const compositionModel = useKeyedItemComposition<T, ChildItem<T>[]>(
    itemOrderSource,
    initialItems,
    ({ newComposition, droppedKeys }) => {
      onKeyOrderChange(newComposition.map((item) => item.key));
      // dropped keys won't be rendered, so we need to manually inform the parent that it's gone.
      droppedKeys.forEach((key) => {
        collectiveConsumer.getItemConsumer(key).onFormValueChange(undefined);
      });
    },
    identity,
  );

  const currentComposition = useSubscribableValue(
    compositionModel.compositions,
    compositionModel.composition,
  );

  // TODO: a more deliberate api with explicit interaction points
  return {
    collectiveConsumer,
    compositionModel,
    currentComposition,
    keyGen,
  };
}

function useSplitArrayFormValueConsumer<T, E>(
  parentConsumer: FormValueConsumer<T[], E[]>,
  initialParentValue: T[],
  keyGenerator: (itemValue: T) => string,
) {
  return useStableValue(() => {
    const keyOrderDetector = new KeyOrderDetector<T>(keyGenerator);
    const {
      valueSource,
      onFormValueChange,
      initialItems,
      itemOrderSource,
      onKeyOrderChange,
    } = splitArrayFormValueConsumer(
      parentConsumer,
      initialParentValue,
      keyOrderDetector,
    );
    const collectiveConsumer = new CollectiveFormValueConsumer({
      valueSource,
      onFormValueChange,
    });
    return {
      collectiveConsumer,
      initialItems,
      itemOrderSource,
      onKeyOrderChange,
    };
  }, [parentConsumer]);
}

function useCountingKeygen() {
  const counterRef = React.useRef(0);
  return () => (counterRef.current++).toString();
}
