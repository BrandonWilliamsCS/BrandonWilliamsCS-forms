import { translateSubscribable } from "@blueharborsolutions/data-tools/observable";
import {
  FormControlError,
  FormValue,
  validityError,
  validityFor,
} from "../value";
import { FormControlInterface } from "./FormControlInterface";

export class FormControlGroup<TParent, E> {
  private readonly latestChildChanges = new Map<
    keyof TParent,
    FormValue<unknown, E>
  >();
  private readonly childInterfaces = new Map<
    keyof TParent,
    FormControlInterface<unknown, E>
  >();

  public constructor(
    private readonly parentInterface: FormControlInterface<TParent, E>,
  ) {}

  public getChildInterface<K extends keyof TParent>(
    key: K,
  ): FormControlInterface<TParent[K], E> {
    if (!this.childInterfaces.has(key)) {
      const newSource = this.buildChildInterface(key);
      this.childInterfaces.set(key, newSource);
    }
    return this.childInterfaces.get(key)!;
  }

  private buildChildInterface<K extends keyof TParent>(
    key: K,
  ): FormControlInterface<unknown, E> {
    return {
      valueSource: translateSubscribable(
        this.parentInterface.valueSource,
        (parentValue, emit) => {
          emit(parentValue[key]);
        },
      ),
      onValueChange: (childFormValue) => {
        this.latestChildChanges.set(key, childFormValue);
        const parentFormValue = this.buildParentFormValue();
        this.parentInterface.onValueChange(parentFormValue);
      },
    };
  }

  private buildParentFormValue(): FormValue<TParent, E> {
    const parentValue = {} as TParent;
    let hasInnerErrors = false;
    const innerErrors = {} as Record<
      keyof TParent,
      FormControlError<E> | undefined
    >;
    for (const [key, formValue] of this.latestChildChanges.entries()) {
      parentValue[key] = formValue.value as any;
      const innerError = validityError(formValue.validity);
      if (innerError) {
        innerErrors[key] = innerError;
        hasInnerErrors = true;
      }
    }
    const groupError: FormControlError<E> | undefined = hasInnerErrors
      ? { variant: "group", errors: [], innerErrors }
      : undefined;
    return {
      value: parentValue,
      validity: validityFor(groupError),
    };
  }
}
