/**
 * Represents a form submission, including both its form value and a possible
 *  `submitValue` that recognizes different submit options.
 */
export interface FormSubmission<TValue, TSubmit> {
  value: TValue;
  submitValue: TSubmit;
}
