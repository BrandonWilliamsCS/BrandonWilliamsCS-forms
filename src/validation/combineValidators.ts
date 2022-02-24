import { Validator } from ".";

export function combineValidators<T, E1, E2>(
  validator1: Validator<T, E1[]> | undefined,
  validator2: Validator<T, E2[]> | undefined,
): Validator<T, (E1 | E2)[]>;
export function combineValidators<T, E>(
  ...validators: Array<Validator<T, E[]> | undefined>
): Validator<T, E[]>;
export function combineValidators<T, E>(
  ...validators: Array<Validator<T, E[]> | undefined>
): Validator<T, E[]> {
  return (value: T) => {
    const allErrors: E[] = [];
    validators.forEach((validator) => {
      const validatorErrors = validator?.(value);
      if (validatorErrors) {
        allErrors.push(...validatorErrors);
      }
    });
    return allErrors.length > 0 ? allErrors : undefined;
  };
}
