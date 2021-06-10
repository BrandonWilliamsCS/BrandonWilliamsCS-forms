import { ValidationError } from "./ValidationError";

/**
 * Validates a value by computing the errors that apply to it.
 * @remarks
 * It is common to support "asynchronous validation" - for example, a username
 * field that needs to be checked against the database for uniqueness. However,
 * that can instead be modeled as the synchronous validation of a facet of
 * the username - one that happens to be uncertain sometimes. It is suitable to
 * handle the asynchronicity as a value-side concern and validate synchronously.
 */
export type Validator<T, E extends ValidationError> = (
  value: T | undefined,
) => E[] | undefined;
