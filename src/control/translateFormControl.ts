import { HandlerInterceptor, interceptHandler, Mapper } from "../utility";
import { FormControlInterface } from "./FormControlInterface";

/**
 * Enables a FormControl to present a modified interface based on translated values.
 *
 * @remarks
 * This is useful when an underlying component (e.g., a text field) has one
 * type but its consumer requires another (e.g., a date or other parsed value).
 * It also enables "filtering" of values through interception.
 *
 * @param sourceInterface - A base FormControl that will be split.
 * @param mapValue - Logic for translating a value from source to target.
 * @param changeInterceptor - Logic for translating changes back from target to source.
 */
export function translateFormControl<S, T>(
  sourceInterface: FormControlInterface<S>,
  mapValue: Mapper<S | undefined, T | undefined>,
  changeInterceptor: HandlerInterceptor<T, S>,
): FormControlInterface<T> {
  return {
    value: mapValue(sourceInterface.value),
    onValueChange: interceptHandler(
      sourceInterface.onValueChange,
      changeInterceptor,
    ),
  };
}
