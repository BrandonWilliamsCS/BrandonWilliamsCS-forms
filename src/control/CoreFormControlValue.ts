import { BehaviorSubject, Observable } from "rxjs";
import { Validator } from "../validation";
import { FormValue, validityFor } from "../value";
import { FormControlValue } from "./FormControlValue";

export class CoreFormControlValue<T, E> implements FormControlValue<T, E> {
  private validator: Validator<T, E> | undefined;
  private readonly formValueSubject: BehaviorSubject<
    FormValue<T, E> | undefined
  >;
  public get formValues(): Observable<FormValue<T, E> | undefined> {
    return this.formValueSubject;
  }

  public get formValue(): FormValue<T, E> | undefined {
    return this.formValueSubject.value;
  }

  constructor(
    initialValue: T,
    initialValidator: Validator<T, E> | undefined,
    public equalityComparer = (a: T, b: T) => a === b,
  ) {
    this.validator = initialValidator;
    const initialFormValue = this.computeFormValue(initialValue);
    this.formValueSubject = new BehaviorSubject<FormValue<T, E> | undefined>(
      initialFormValue,
    );
  }

  setValue(value: T): void {
    if (this.formValue && this.equalityComparer(value, this.formValue?.value)) {
      return;
    }
    const formValue = this.computeFormValue(value);
    this.formValueSubject.next(formValue);
  }

  setValidator(validator: Validator<T, E> | undefined) {
    this.validator = validator;
    // TODO: re-compute form value and emit ONLY if changed
  }

  clearValue(): void {
    if (!this.formValue) {
      return;
    }
    this.formValueSubject.next(undefined);
  }

  protected computeFormValue(baseValue: T): FormValue<T, E> {
    const error = this.validator?.(baseValue);
    const validity = validityFor(error);
    return {
      value: baseValue,
      validity,
    };
  }
}
