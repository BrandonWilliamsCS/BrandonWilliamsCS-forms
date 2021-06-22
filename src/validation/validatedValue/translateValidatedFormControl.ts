import { FormControlInterface } from "../../control";
import { ValidatedValue } from "../../primary";
import { HandlerInterceptor, interceptHandler, Mapper } from "../../utility";

/**
 * Enables a FormControl to present a modified interface based on translated ValidatedValues.
 *
 * @remarks
 * This variant of translateValidatedFormControl encapsulates ValidatedValue
 * semantics so that the consumer can focus on mapping/intercepting base types.
 * @param sourceInterface - A base FormControl that will be split.
 * @param mapValue - Logic for translating a value from source to target.
 * @param changeInterceptor - Logic for translating changes back from target to source.
 */
export function translateValidatedFormControl<S, T, E>(
  sourceInterface: FormControlInterface<ValidatedValue<S, E>>,
  mapValue: Mapper<S, T>,
  changeInterceptor: HandlerInterceptor<T, S>,
): FormControlInterface<ValidatedValue<T, E>> {
  const translatedValue: ValidatedValue<T, E> | undefined =
    sourceInterface.value && {
      value: mapValue(sourceInterface.value.value),
      validity: sourceInterface.value.validity,
    };
  const validatedValueInterceptor: HandlerInterceptor<
    ValidatedValue<T, E>,
    ValidatedValue<S, E>
  > = (tValue, base) => {
    // We have an interceptor for T -> S, but need to work with ValidatedValue of each.
    // So, defer to that interceptor but unwrap/wrap base values to bridge the gap.
    changeInterceptor(tValue.value, (sValue) => {
      base({
        value: sValue,
        validity: tValue.validity,
      });
    });
  };
  return {
    value: translatedValue,
    onValueChange: interceptHandler(
      sourceInterface.onValueChange,
      validatedValueInterceptor,
    ),
  };
}
