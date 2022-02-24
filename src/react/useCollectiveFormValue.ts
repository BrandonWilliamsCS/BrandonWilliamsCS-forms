import React from "react";
import { toPairs } from "lodash";
import {
  useStableValue,
  useSubscription,
} from "@blueharborsolutions/react-data-tools";

import { FormValueConsumer } from "../value";
import { CollectiveFormValueConsumer } from "../value/transform";

export function useCollectiveFormValue<T, E>(
  parentConsumer: FormValueConsumer<Record<string, T>, Record<string, E>>,
  initialParentValue: Record<string, T>,
) {
  const [currentItems, setCurrentItems] = React.useState<
    { key: string; initialValue: T }[]
  >(() =>
    toPairs(initialParentValue).map(([key, initialValue]) => ({
      key,
      initialValue,
    })),
  );
  const collectiveConsumer = useStableValue(() => {
    return new CollectiveFormValueConsumer(parentConsumer);
  }, [parentConsumer]);
  function addItem(key: string, initialValue: T) {
    setCurrentItems((prev) => [...prev, { key, initialValue }]);
  }
  function removeItem(key: string) {
    setCurrentItems((prev) => prev.filter((pair) => pair.key !== key));
    collectiveConsumer.getItemConsumer(key).onFormValueChange(undefined);
  }
  useSubscription(collectiveConsumer.newItems, ({ key, itemValue }) => {
    addItem(key, itemValue);
  });
  useSubscription(collectiveConsumer.omittedItems, removeItem);
  return { collectiveConsumer, currentItems, addItem, removeItem };
}
