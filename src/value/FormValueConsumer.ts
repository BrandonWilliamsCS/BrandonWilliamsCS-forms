import { Observable } from "rxjs";
import { FormValue } from "./FormValue";

/**
 * The fundamental building block for communicating values to and from forms,
 * form controls, and their various consumers. Anything that should influence or
 * utilize the value of a form or form control must do so via this interface.
 */
export interface FormValueConsumer<T, E> {
  /** The source of any "incoming" or "top-down" values from a consumer to a form control. */
  valueSource: Observable<T>;
  /** Notifies the consumer of every new FormValue produced by the form control. */
  onFormValueChange: (formValue: FormValue<T, E> | undefined) => void;
}
