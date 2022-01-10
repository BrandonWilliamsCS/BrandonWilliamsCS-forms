import { translateSubscribable } from "@blueharborsolutions/data-tools/observable";
import {
  FormControlError,
  FormValue,
  validityError,
  validityFor,
} from "../value";
import { FormControlInterface } from "./FormControlInterface";

export class FormControlArray<T, E> {
  private readonly latestChildChanges: Array<FormValue<unknown, E>> = [];
  private readonly childInterfaces: Array<FormControlInterface<unknown, E>> =
    [];

  public constructor(
    private readonly parentInterface: FormControlInterface<T[], E>,
  ) {}

  public getChildInterface(index: number): FormControlInterface<T, E> {
    if (!(index in this.childInterfaces)) {
      const newSource = this.buildChildInterface(index);
      this.childInterfaces[index] = newSource;
    }
    return this.childInterfaces[index];
  }

  private buildChildInterface(index: number): FormControlInterface<unknown, E> {
    return {
      valueSource: translateSubscribable(
        this.parentInterface.valueSource,
        (parentValue, emit) => {
          emit(parentValue[index]);
        },
      ),
      onValueChange: (childFormValue) => {
        this.latestChildChanges[index] = childFormValue;
        const parentFormValue = this.buildParentFormValue();
        this.parentInterface.onValueChange(parentFormValue);
      },
    };
  }

  private buildParentFormValue(): FormValue<T[], E> {
    const parentValue: T[] = [];
    let hasInnerErrors = false;
    const innerErrors: Array<FormControlError<E> | undefined> = [];
    this.latestChildChanges.forEach((formValue, index) => {
      parentValue[index] = formValue.value as any;
      const innerError = validityError(formValue.validity);
      if (innerError) {
        innerErrors[index] = innerError;
        hasInnerErrors = true;
      }
    });
    const arrayError: FormControlError<E> | undefined = hasInnerErrors
      ? { variant: "array", errors: [], innerErrors }
      : undefined;
    return {
      value: parentValue,
      validity: validityFor(arrayError),
    };
  }
}
