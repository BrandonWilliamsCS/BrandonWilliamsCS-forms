import { NEVER, Subject } from "rxjs";
import { mergeWith } from "rxjs/operators";
import { FormValue } from "../FormValue";
import { FormValueConsumer } from "../FormValueConsumer";

export class FormValueAdapter<T, E> implements FormValueConsumer<T, E> {
  private readonly mergedValueSubject = new Subject<T>();

  constructor(private readonly baseConsumer?: FormValueConsumer<T, E>) {}

  // Incoming values - combine base stream with direct access

  public readonly valueSource = (this.baseConsumer?.valueSource ?? NEVER).pipe(
    mergeWith(this.mergedValueSubject),
  );

  setValue(value: T) {
    this.mergedValueSubject.next(value);
  }

  // Outgoing FormValues - notify base consumer plus direct observers

  private latestFormValue: FormValue<T, E> | undefined;
  public readonly formValues = new Subject<FormValue<T, E> | undefined>();

  public get formValue() {
    return this.latestFormValue;
  }

  onFormValueChange(formValue: FormValue<T, E> | undefined) {
    this.latestFormValue = formValue;
    this.formValues.next(formValue);
    this.baseConsumer?.onFormValueChange(formValue);
  }
}
