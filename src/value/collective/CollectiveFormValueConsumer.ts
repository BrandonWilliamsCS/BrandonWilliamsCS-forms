import { filter, map } from "rxjs";
import { toPairs } from "lodash";

import { FormValue } from "../FormValue";
import { FormValueConsumer } from "../FormValueConsumer";
import { FormValueAdapter } from "../transform/FormValueAdapter";
import { validityFor } from "../Validity";

/**
 * Reponsible for modelling one parent FormValueConsumer as a collection of child
 * FormValueAdapters.
 */
export class CollectiveFormValueConsumer<T, E> {
  private readonly itemAdapters: Record<string, FormValueAdapter<T, E>> = {};

  public constructor(
    private readonly parentConsumer: FormValueConsumer<
      Record<string, T>,
      Record<string, E>
    >,
  ) {}

  public getItemConsumer(key: string): FormValueAdapter<T, E> {
    if (!this.itemAdapters[key]) {
      const newSource = this.buildItemConsumer(key);
      this.itemAdapters[key] = newSource;
    }
    return this.itemAdapters[key];
  }

  public buildParentFormValue():
    | FormValue<Record<string, T>, Record<string, E>>
    | undefined {
    const parentValue = {} as Record<string, T>;
    let hasInnerErrors = false;
    const innerErrors: Record<string, E> = {};
    for (const [key, childAdapter] of toPairs(this.itemAdapters)) {
      const childFormValue = childAdapter.formValue;
      if (!childFormValue) {
        continue;
      }
      parentValue[key] = childFormValue.value;
      if (!childFormValue.validity.isValid) {
        innerErrors[key] = childFormValue.validity.error;
        hasInnerErrors = true;
      }
    }
    return {
      value: parentValue,
      validity: validityFor(hasInnerErrors ? innerErrors : undefined),
    };
  }

  private buildItemConsumer(key: string): FormValueAdapter<T, E> {
    return new FormValueAdapter<T, E>({
      valueSource: this.parentConsumer.valueSource.pipe(
        filter((parentValue) => key in parentValue),
        map((parentValue) => parentValue[key]),
      ),
      onFormValueChange: () => {
        // TODO: consider a way to prevent partial changes when initializing
        const parentFormValue = this.buildParentFormValue();
        this.parentConsumer.onFormValueChange(parentFormValue);
      },
    });
  }
}
