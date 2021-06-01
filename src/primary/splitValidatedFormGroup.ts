import {
  CompositeFormControlInterface,
  FormControlInterface,
  splitFormControl,
} from "../control";
import { ValidatedValue } from "../validation";

import {
  extractGroupChild,
  recombineGroupChild,
  ValidatedGroupMap,
} from "../validation/validatedValue/ValidatedGroupMap";

export function splitValidatedFormGroup<T extends Record<string, any>>(
  groupInterface: FormControlInterface<ValidatedValue<Partial<T>>>,
): CompositeFormControlInterface<ValidatedGroupMap<T>> {
  return splitFormControl<ValidatedValue<Partial<T>>, ValidatedGroupMap<T>>(
    groupInterface,
    extractGroupChild,
    recombineGroupChild,
  );
}
