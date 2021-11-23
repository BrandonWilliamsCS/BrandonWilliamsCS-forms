import React from "react";
import { FormControlInterface } from "../control";
import { Validator } from "../validation";
import { FormValue, Validity, validityFor } from "../value";

/**
 * Maintains behavior and state for a simple form field.
 * @remarks
 * Some fields have complex state that changes independently from the current
 * form value. Most fields, however, only need to combine changes from both
 * the consumer and the internal control implementation into one current value.
 * This hook facilitates the latter, simpler case.
 * @param controlInterface the interface defining use of this control
 * @param validator determines validity of each new value
 * @param initialValue the field's value before any changes have been made
 */
export function useSimpleField<T, E>(
  controlInterface: FormControlInterface<T, E>,
  validator: Validator<T, E> | undefined,
  initialValue: T,
): UnpackedValidatedInterface<T, E> {
  const normalizedValidator = validator ?? (() => undefined);
  const [currentValue, setCurentValue] = React.useState<FormValue<T, E>>(() =>
    computeFormValue(initialValue!, normalizedValidator),
  );

  // Keep both the "internal", control value and the "external" consumer
  //  value in sync by using the same change logic for both.
  const onBaseValueChange = (nextValue: T) => {
    const nextFormValue = computeFormValue(nextValue!, normalizedValidator);
    setCurentValue(nextFormValue);
    controlInterface.onValueChange(nextFormValue);
  };

  // Initialize based on the default value.
  React.useEffect(() => {
    onBaseValueChange(initialValue!);
  }, []);

  // Listen for external changes by subscribing to the control interface.
  React.useEffect(() => {
    const unsubscribable = controlInterface.valueSource.subscribe({
      next: onBaseValueChange,
    });
    return unsubscribable.unsubscribe;
  }, [controlInterface.valueSource]);

  // Present the latest value to the consumer and listen to its changes.
  return {
    baseValue: currentValue.value,
    validity: currentValue.validity,
    onBaseValueChange,
  };
}

export interface UnpackedValidatedInterface<T, E> {
  baseValue: T;
  validity: Validity<E>;
  onBaseValueChange: (next: T) => void;
}

function computeFormValue<T, E>(baseValue: T, validator: Validator<T, E>) {
  return {
    value: baseValue,
    validity: computeBaseValidity(baseValue, validator),
  };
}

function computeBaseValidity<T, E>(
  value: T,
  validator: Validator<T, E>,
): Validity<E> {
  const errors = validator(value);
  return validityFor(errors ? { variant: "field", errors } : undefined);
}
