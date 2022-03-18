import { useStableValue } from "@brandonwilliamscs/react-data-tools";
import { toPairs } from "lodash";

import { FormValueConsumer } from "../value";
import { CollectiveFormValueConsumer } from "../value/collective/CollectiveFormValueConsumer";
import { ChildItem, useKeyedItemComposition } from "./useKeyedItemComposition";

export function useCollectiveFormValue<T, E>(
  parentConsumer: FormValueConsumer<Record<string, T>, Record<string, E>>,
  initialParentValue: Record<string, T>,
) {
  const collectiveConsumer = useStableValue(
    () => new CollectiveFormValueConsumer(parentConsumer),
    [parentConsumer],
  );
  const compositionModel = useKeyedItemComposition<T, Record<string, T>>(
    parentConsumer.valueSource,
    initialParentValue,
    ({ droppedKeys }) => {
      // dropped keys won't be rendered, so we need to manually inform the parent that it's gone.
      droppedKeys.forEach((key) => {
        collectiveConsumer.getItemConsumer(key).onFormValueChange(undefined);
      });
    },
    adjustChildItems,
  );

  // TODO: a more deliberate api with explicit interaction points
  return {
    collectiveConsumer,
    compositionModel,
  };
}

function adjustChildItems<T>(
  incoming: Record<string, T>,
  existing: ChildItem<T>[],
): ChildItem<T>[] {
  const remainingItems = existing.filter(
    (existingItem) => existingItem.key in incoming,
  );
  const addedItems = toPairs(incoming)
    .filter(
      ([key]) => !existing.some((existingItem) => existingItem.key === key),
    )
    .map(([key, value]) => ({ key, value }));
  return [...remainingItems, ...addedItems];
}
