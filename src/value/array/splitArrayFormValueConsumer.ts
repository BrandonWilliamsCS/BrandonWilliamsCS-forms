import { fromPairs } from "lodash";
import { map, Observable, share } from "rxjs";

import { ChildItem } from "../collective/KeyedItemComposition";
import { FormValue } from "../FormValue";
import { FormValueConsumer } from "../FormValueConsumer";
import { validityFor } from "../Validity";
import { KeyOrderDetector } from "./KeyOrderDetector";

/**
 * Separates an array-valued FormValueConsumer by separating out the key order
 * and collective FormValue concerns based on a provided key orderer.
 */
export function splitArrayFormValueConsumer<T, E>(
  parentConsumer: FormValueConsumer<T[], E[]>,
  initialParentValue: T[],
  keyOrderDetector: KeyOrderDetector<T>,
): OrderedCollectiveFormValueConsumer<T, E> {
  // For incoming/parent source values, first detect ordering for later use.
  const orderedSourceValueChanges = parentConsumer.valueSource.pipe(
    map((arrayValue) => keyOrderDetector.keyifyByReferenceValue(arrayValue)),
    // share this to avoid re-keyifying for each subscriber
    share(),
  );
  let currentKeyOrder: string[] = [];
  let latestCollectionFormValue:
    | FormValue<Record<string, T>, Record<string, E>>
    | undefined;
  function emitOrderedFormValue() {
    const arrayFormValue = sequentializeFormValue(
      latestCollectionFormValue,
      currentKeyOrder,
    );
    parentConsumer.onFormValueChange(arrayFormValue);
  }
  return {
    // FormValueConsumer for the collective parent value
    valueSource: orderedSourceValueChanges.pipe(map(fromPairs)),
    onFormValueChange: (collectionFormValue) => {
      latestCollectionFormValue = collectionFormValue;
      keyOrderDetector.setReferenceValues(collectionFormValue?.value ?? {});
      emitOrderedFormValue();
    },
    // Pseudo-FormValueConsumer for item orderings
    initialItems: pairsToItems(
      keyOrderDetector.keyifyByReferenceValue(initialParentValue),
    ),
    itemOrderSource: orderedSourceValueChanges.pipe(map(pairsToItems)),
    onKeyOrderChange: (newOrder) => {
      currentKeyOrder = newOrder;
      emitOrderedFormValue();
    },
  };
}

/**
 * Pairs a collective FormValueConsumer with a similar interface for key ordering.
 */
export interface OrderedCollectiveFormValueConsumer<T, E>
  extends FormValueConsumer<Record<string, T>, Record<string, E>> {
  initialItems: ChildItem<T>[];
  itemOrderSource: Observable<ChildItem<T>[]>;
  onKeyOrderChange: (newOrder: string[]) => void;
}

function sequentializeFormValue<T, E>(
  collectionFormValue:
    | FormValue<Record<string, T>, Record<string, E>>
    | undefined,
  currentKeyOrder: string[],
): FormValue<T[], E[]> | undefined {
  if (!collectionFormValue) {
    return undefined;
  }
  const collectionValue = collectionFormValue.value;
  const collectionError = collectionFormValue.validity.isValid
    ? {}
    : collectionFormValue.validity.error;
  const value: T[] = [];
  const errors: E[] = [];
  let hasErrors = false;
  let i = 0;
  currentKeyOrder.forEach((key) => {
    // Ignore keys that didn't make their way into the value.
    // This is why we need to track `i` manually.
    if (!(key in collectionValue)) {
      return;
    }
    // Keep errors matched with values by setting by indices.
    value[i] = collectionValue[key];
    if (key in collectionError) {
      errors[i] = collectionError[key];
      hasErrors = true;
    }
    i++;
  });
  return {
    value,
    validity: validityFor(hasErrors ? errors : undefined),
  };
}

function pairsToItems<T>(pairs: [string, T][]): ChildItem<T>[] {
  return pairs.map(([key, value]) => ({ key, value }));
}
