import {
  Observer,
  Subject,
  Subscribable,
  Unsubscribable,
} from "@blueharborsolutions/data-tools/observable";
import { FormValue } from "../value";
import { FormControlInterface } from ".";

export class FormControlModel<T, E>
  implements Subscribable<FormValue<T, E>>, FormControlInterface<T, E>
{
  private readonly externalValueSubject = new Subject<T>();
  private readonly valueChangeSubject = new Subject<FormValue<T, E>>();

  public get valueSource(): Subscribable<T> {
    return this.externalValueSubject;
  }

  public constructor() {
    this.onValueChange = this.onValueChange.bind(this);
  }

  public onValueChange(value: FormValue<T, E>) {
    this.valueChangeSubject.next(value);
  }

  public setValue(value: T) {
    this.externalValueSubject.next(value);
  }

  public subscribe(
    observer: Partial<Observer<FormValue<T, E>>>,
  ): Unsubscribable {
    return this.valueChangeSubject.subscribe(observer);
  }
}
