/**
 * Minimally indicates an invalidity of some value.
 * Applications should implement their own schema for producing and consuming
 *  ValidationErrors based on the `type` value.
 */
export interface ValidationError {
  readonly type: string;
  /**
   * Indicates the possible distinction between "wrong" and "not right yet".
   * @remarks
   * For example, values that have invalid characters or are too large are
   * definitely incorrect, whereas an invalid email address may simply not
   * be complete yet.
   * @example
   * `const alwaysWrong = { type: "maxLength", requiresConfirmation: false}`
   * The `alwaysWrong` error indicates a definite mistake in user input; too
   * many characters have been entered. The only remedy is to undo.
   * `const confirmFirst = { type: "minLength", requiresConfirmation: true}`
   * The `confirmFirst` error's value may still be "in-progress"; there may
   * simply be more data to enter, rather than an actual mistake.
   */
  readonly requiresConfirmation: boolean;
}
