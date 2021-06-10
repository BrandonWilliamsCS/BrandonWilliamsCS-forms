import {
  CompositeFormControlInterface,
  FormControlInterface,
  splitFormControl,
} from "../control";
import { ValidatedValue, ValidationError } from "../validation";

import {
  extractGroupChild,
  recombineGroupChild,
  ValidatedGroupMap,
} from "../validation/validatedValue/ValidatedGroupMap";

/**
 * Splits a FormControlInterface that represents a group of children into its
 * component child interfaces.
 * @param groupInterface A FormControlInterface representing a string-keyed group
 */
export function splitValidatedFormGroup<
  T extends Record<string, any>,
  E extends ValidationError,
>(
  groupInterface: FormControlInterface<ValidatedValue<Partial<T>, E>>,
): CompositeFormControlInterface<ValidatedGroupMap<T, E>> {
  return splitFormControl<
    ValidatedValue<Partial<T>, E>,
    ValidatedGroupMap<T, E>
  >(groupInterface, extractGroupChild, recombineGroupChild);
}
