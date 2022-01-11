import { translateSubscribable } from "@blueharborsolutions/data-tools/observable";

import { Mapper } from "../utility";
import { mapFormValue } from "../value";
import { FormControlInterface } from "./FormControlInterface";

/**
 * Enables a FormControl to present a modified interface based on translated values.
 *
 * @remarks
 * This is useful when an underlying component (e.g., a text field) has one
 * type but its consumer requires another (e.g., a date or other parsed value).
 *
 * @param sourceInterface - A base FormControlInterface that will be split.
 * @param mapSourceToTarget - Logic for translating a value from source to target.
 * @param mapTargetToSource - Logic for translating a value back from target to source.
 */
export function translateFormControl<S, T, E>(
  sourceInterface: FormControlInterface<S, E>,
  mapSourceToTarget: Mapper<S, T>,
  mapTargetToSource: Mapper<T, S>,
): FormControlInterface<T, E> {
  return {
    valueSource: translateSubscribable(
      sourceInterface.valueSource,
      (sourceValue, emit) => {
        emit(mapSourceToTarget(sourceValue));
      },
    ),
    onValueChange: (targetFormValue) => {
      const sourceFormValue = mapFormValue(targetFormValue, mapTargetToSource);
      sourceInterface.onValueChange(sourceFormValue);
    },
  };
}
