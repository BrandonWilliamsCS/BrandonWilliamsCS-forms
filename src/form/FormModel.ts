import {
  Observer,
  Subject,
  Subscribable,
  Unsubscribable,
} from "@blueharborsolutions/data-tools/observable";
import { FormControlModel } from "../control";
import { FormValue } from "../value";
import { FormSubmission } from ".";

export class FormModel<T, TSubmit, E>
  implements Subscribable<FormSubmission<T, TSubmit>>
{
  private readonly validSubmitSubject = new Subject<
    FormSubmission<T, TSubmit>
  >();
  private latestValue: FormValue<T, E> | undefined;

  public readonly controlModel = new FormControlModel<T, E>();
  private unsubscribable: Unsubscribable | undefined;

  public constructor() {
    this.unsubscribable = this.controlModel.subscribe({
      next: (value) => {
        this.latestValue = value;
      },
    });
  }

  public triggerSubmit(submitValue: TSubmit) {
    if (this.latestValue?.validity.isValid) {
      this.validSubmitSubject.next({
        value: this.latestValue.value,
        submitValue,
      });
    }
  }

  public subscribe(
    observer: Partial<Observer<FormSubmission<T, TSubmit>>>,
  ): Unsubscribable {
    return this.validSubmitSubject.subscribe(observer);
  }

  public dispose() {
    this.unsubscribable?.unsubscribe();
    this.unsubscribable = undefined;
  }
}
