import { Mapper } from "../utility/Mapper";
import { FormControlInterface } from "./FormControlInterface";

/**
 * Enables a FormControl to present a modified interface based on translated values.
 *
 * @remarks
 * This is useful when an underlying component (e.g., a text field) has one
 * type but its consumer requires another (e.g., a date or other parsed value).
 *
 * @param sourceInterface - A base FormControl that will be split.
 * @param mapValue - Logic for translating a value from source to target.
 * @param remapValue - Logic for translating a value back from target to source.
 */
export function translateFormControl<S, T>(
  sourceInterface: FormControlInterface<S>,
  mapValue: Mapper<S, T>,
  remapValue: Mapper<T, S>,
): FormControlInterface<T> {
  return {
    value: mapValue(sourceInterface.value),
    onValueChange: (nextValue: T) => {
      sourceInterface.onValueChange(remapValue(nextValue));
    },
  };
}
