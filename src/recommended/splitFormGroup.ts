import {
  CompositeFormControlInterface,
  FormControlInterface,
  splitFormControl,
  ValueExtractor,
  ValueRecombiner,
} from "../control";
import {
  addGroupedError,
  FormControlError,
  mapValidity,
  Validity,
  validityError,
  validityFor,
} from "../validation";

import { FormControlState } from "./FormControlState";

export function splitFormGroup<T extends Record<string, any>>(
  groupInterface: FormControlInterface<FormControlState<T>>,
): CompositeFormControlInterface<StateGroupMap<T>> {
  const extractGroupChild: ValueExtractor<
    FormControlState<T>,
    StateGroupMap<T>
  > = <K extends keyof StateGroupMap<T>>(
    groupValue: FormControlState<T>,
    key: K,
  ) => ({
    value: groupValue.value[key],
    validity: extractGroupChildValidity(groupValue, key),
  });
  const recombineGroupChild: ValueRecombiner<
    FormControlState<T>,
    StateGroupMap<T>
  > = <K extends keyof StateGroupMap<T>>(
    prevGroupValue: FormControlState<T>,
    nextChildValue: FormControlState<T[K]>,
    key: K,
  ) => ({
    value: {
      ...prevGroupValue.value,
      [key]: nextChildValue.value,
    },
    validity: updateGroupValidity<T>(
      prevGroupValue.validity,
      nextChildValue.validity,
      key,
    ),
  });
  return splitFormControl(
    groupInterface,
    extractGroupChild,
    recombineGroupChild,
  );
}

function extractGroupChildValidity<T, K extends keyof T & string>(
  groupValue: FormControlState<T>,
  key: K,
): Validity {
  return mapValidity(groupValue.validity, (groupError: FormControlError) =>
    groupError.variant === "group" ? groupError.innerErrors[key] : undefined,
  );
}

type StateGroupMap<T extends Record<string, any>> = {
  [key in keyof T & string]: FormControlState<T[key]>;
};

function updateGroupValidity<T extends Record<string, any>>(
  currentOuterValidity: Validity,
  nextItemValidity: Validity,
  innerName: keyof T & string,
): Validity {
  const currentOuterError = validityError(currentOuterValidity);
  // In the buggy case that the validity doesn't fit a group, just ditch the error.
  const currentGroupError =
    currentOuterError?.variant === "group" ? currentOuterError : undefined;
  const nextItemError = nextItemValidity.isValid
    ? undefined
    : nextItemValidity.error;
  const newGroupError = addGroupedError(
    currentGroupError,
    nextItemError,
    innerName,
  );
  return validityFor(newGroupError);
}
