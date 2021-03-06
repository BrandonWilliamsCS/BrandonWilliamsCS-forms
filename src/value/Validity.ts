/**
 * Portrays the validity of some external value by conditionally referencing an error.
 * @remarks
 * It is common to support "asynchronous validation" - for example, a username
 * field that needs to be checked against the database for uniqueness. However,
 * even while processing, a value is either known ot be valid or it isn't. Thus,
 * `Validity` does not attempt to cover asynchronicity.
 */
export type Validity<E> =
  | {
      readonly isValid: true;
    }
  | {
      readonly isValid: false;
      readonly error: E;
    };

/** The single (logically unique) valid `Validity`. Immutable and === safe. */
export const validValidity: Validity<never> = Object.freeze({
  isValid: true,
});

export function errorValidity<E>(error: E): Validity<E> {
  return {
    isValid: false,
    error,
  };
}

/**
 * Extracts the `FormControlError` from a `Validity`, if present.
 * @param validity a possibly-invalid `Validity`
 * @returns the error, if invalid
 */
export function validityError<E>(validity: Validity<E>): E | undefined {
  return validity.isValid ? undefined : validity.error;
}

/**
 * Creates a validity based on the possibility of an error.
 * @param error the possible error to wrap a validity
 * @returns the appropriate validity.
 */
export function validityFor<E>(error: E | undefined): Validity<E> {
  return error
    ? {
        isValid: false,
        error,
      }
    : validValidity;
}

/**
 * Translates validity based on a translation of its component error.
 * @param baseValidity a validity to translate from
 * @param errorMapper the logic for translating component errors
 * @returns A new validity based on the mapped error
 */
export function mapValidity<E>(
  baseValidity: Validity<E>,
  errorMapper: (baseError: E) => E | undefined,
): Validity<E> {
  if (baseValidity.isValid) {
    return baseValidity;
  }
  const mappedError = errorMapper(baseValidity.error);
  return validityFor(mappedError);
}
