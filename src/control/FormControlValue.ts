import { Observable } from "rxjs";
import { FormValue } from "../value";

export interface FormControlValue<T, E> {
  readonly formValue: FormValue<T, E> | undefined;
  readonly formValues: Observable<FormValue<T, E> | undefined>;
  setValue(next: T): void;
}
