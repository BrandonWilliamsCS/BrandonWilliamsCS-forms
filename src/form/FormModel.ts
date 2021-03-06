import { Observable, Subject } from "rxjs";
import { FormSubmission } from "../form";
import { FormValue } from "../value";
import { FormValueAdapter } from "../value/transform";

export class FormModel<T, TSubmit, E> {
  public readonly valueAdapter = new FormValueAdapter<T, E>();
  private readonly submitSubject = new Subject<
    FormSubmission<FormValue<T, E>, TSubmit>
  >();

  public get formValue(): FormValue<T, E> | undefined {
    return this.valueAdapter.formValue;
  }

  public get submits(): Observable<FormSubmission<FormValue<T, E>, TSubmit>> {
    return this.submitSubject;
  }

  public triggerSubmit(submitValue: TSubmit) {
    const formValue = this.valueAdapter.formValue;
    if (!formValue) {
      this.submitSubject.error(new Error("Cannot submit form with no value"));
      return;
    }
    this.submitSubject.next({
      value: formValue,
      submitValue,
    });
  }
}
