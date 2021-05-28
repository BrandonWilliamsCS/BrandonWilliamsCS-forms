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

export function splitValidatedFormArray<T>(
  arrayInterface: FormControlInterface<ValidatedValue<T[]>>,
): FormControlInterface<ValidatedValue<T>>[] {
  const compositeInterface = splitValidatedFormArrayComposite(arrayInterface);
  return arrayInterface.value.value.map((_, i) => compositeInterface(i));
}

export function splitValidatedFormArrayComposite<T>(
  arrayInterface: FormControlInterface<ValidatedValue<T[]>>,
): CompositeFormControlInterface<ValidatedArrayMap<T>> {
  return splitFormControl<ValidatedValue<T[]>, ValidatedArrayMap<T>>(
    arrayInterface,
    extractArrayChild,
    recombineArrayChild,
  );
}
