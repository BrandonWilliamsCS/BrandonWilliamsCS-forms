import { Mapper } from "../utility";
import { Validity, mapValidity } from "./Validity";

/**
 * Presents a consumer value alongside its validity in the context of a form.
 */
export interface FormValue<T, E> {
  value: T;
  validity: Validity<E>;
}

export function mapFormValue<T, U, E>(
  formValue: FormValue<T, E>,
  mapper: Mapper<T, U>,
): FormValue<U, E> {
  return {
    value: mapper(formValue.value),
    validity: formValue.validity,
  };
}
