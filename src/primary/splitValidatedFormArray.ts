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
export function splitValidatedFormArray<T>(
  arrayInterface: FormControlInterface<ValidatedValue<T[]>>,
): FormArrayBundle<T> {
  const compositeInterface = splitFormControl<
    ValidatedValue<T[]>,
    ValidatedArrayMap<T>
  >(arrayInterface, extractArrayChild, recombineArrayChild);
  const interfaceArray =
    arrayInterface.value?.value.map((_, i) => compositeInterface(i)) ?? [];
  return {
    compositeInterface,
    interfaceArray,
  };
}

export interface FormArrayBundle<T> {
  compositeInterface: CompositeFormControlInterface<ValidatedArrayMap<T>>;
  interfaceArray: FormControlInterface<ValidatedValue<T>>[];
}
