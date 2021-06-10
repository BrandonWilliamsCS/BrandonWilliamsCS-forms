import {
  CompositeFormControlInterface,
  FormControlInterface,
  splitFormControl,
} from "../control";
import { ValidatedValue } from "../validation";

import {
  extractArrayChild,
  recombineArrayChild,
  ValidatedArrayMap,
} from "../validation/validatedValue/ValidatedArrayMap";

/**
 * Splits a FormControlInterface that represents a sequence of children into its
 * component child interfaces.
 * @param arrayInterface A FormControlInterface representing a sequence
 */
export function splitValidatedFormArray<T, E>(
  arrayInterface: FormControlInterface<ValidatedValue<T[], E>>,
): FormArrayBundle<T, E> {
  const compositeInterface = splitFormControl<
    ValidatedValue<T[], E>,
    ValidatedArrayMap<T, E>
  >(arrayInterface, extractArrayChild, recombineArrayChild);
  const interfaceArray =
    arrayInterface.value?.value.map((_, i) => compositeInterface(i)) ?? [];
  return {
    compositeInterface,
    interfaceArray,
  };
}

export interface FormArrayBundle<T, E> {
  compositeInterface: CompositeFormControlInterface<ValidatedArrayMap<T, E>>;
  interfaceArray: FormControlInterface<ValidatedValue<T, E>>[];
}
