import {
  useStableValue,
  useSubscription,
} from "@blueharborsolutions/react-data-tools";
import React from "react";
import { Observable } from "rxjs";

import {
  ChildItem,
  CompositionChange,
  KeyedItemComposition,
} from "../value/collective/KeyedItemComposition";

export type { ChildItem } from "../value/collective/KeyedItemComposition";

export function useKeyedItemComposition<T, P>(
  parentValues: Observable<P>,
  initialParentValue: P,
  onCompositionChange: (change: CompositionChange<T>) => void,
  incorporateParentValues: (
    incoming: P,
    existing: ChildItem<T>[],
  ) => ChildItem<T>[],
) {
  const compositionModel = useStableValue(
    () =>
      new KeyedItemComposition<T>(
        incorporateParentValues(initialParentValue, []),
      ),
    [],
  );
  // Incorporate incoming parent values into compositon
  useSubscription(parentValues, (parentValue) => {
    compositionModel.setItems(
      incorporateParentValues(parentValue, compositionModel.composition),
    );
  });
  // Notify listeners of composition changes
  useSubscription(compositionModel.changes, onCompositionChange);
  // Also notify listeners of initial composition.
  React.useEffect(() => {
    onCompositionChange({
      newComposition: compositionModel.composition,
      droppedKeys: [],
    });
  }, []);
  return compositionModel;
}
