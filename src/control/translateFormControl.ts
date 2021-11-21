import { translateSubscribable } from "@blueharborsolutions/data-tools/observable";

import { HandlerInterceptor, interceptHandler, Mapper } from "../utility";
import { FormValue } from "../value/FormValue";
import { FormControlInterface } from "./FormControlInterface";

/**
 * Enables a FormControl to present a modified interface based on translated values.
 *
 * @remarks
 * This is useful when an underlying component (e.g., a text field) has one
 * type but its consumer requires another (e.g., a date or other parsed value).
 * It also enables "filtering" of outgoing values through interception.
 *
 * @param sourceInterface - A base FormControlInterface that will be split.
 * @param mapValue - Logic for translating a value from source to target.
 * @param changeInterceptor - Logic for translating changes back from target to source.
 */
export function translateFormControl<S, T, E>(
  sourceInterface: FormControlInterface<S, E>,
  mapValue: Mapper<S, T>,
  changeInterceptor: HandlerInterceptor<FormValue<T, E>, FormValue<S, E>>,
): FormControlInterface<T, E> {
  return {
    valueSource: translateSubscribable(
      sourceInterface.valueSource,
      (value, emit) => {
        emit(mapValue(value));
      },
    ),
    onValueChange: interceptHandler(
      sourceInterface.onValueChange,
      changeInterceptor,
    ),
  };
}
