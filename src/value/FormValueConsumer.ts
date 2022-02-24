import { Observable } from "rxjs";
import { FormValue } from "./FormValue";

export interface FormValueConsumer<T, E> {
  valueSource: Observable<T>;
  onFormValueChange: (formValue: FormValue<T, E> | undefined) => void;
}
