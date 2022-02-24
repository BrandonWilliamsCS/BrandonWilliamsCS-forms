import { NEVER, Subject } from "rxjs";
import { toPairs } from "lodash";
import { FormValue } from "../FormValue";
import { FormValueConsumer } from "../FormValueConsumer";
import { validityFor } from "../Validity";
import { FormValueAdapter } from "./FormValueAdapter";

export class CollectiveFormValueConsumer<T, E> {
  private readonly itemAdapters: Record<string, FormValueAdapter<T, E>> = {};
  private readonly keyActivity: Record<string, boolean> = {};
  private readonly newItemSubject = new Subject<{
    key: string;
    itemValue: T;
  }>();
  private readonly omittedItemSubject = new Subject<string>();
  private readonly subscription = this.parentConsumer.valueSource.subscribe(
    this.transferValueToItems.bind(this),
  );

  public get newItems() {
    return this.newItemSubject;
  }

  public get omittedItems() {
    return this.omittedItemSubject;
  }

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
    this.keyActivity[key] = true;
    return this.itemAdapters[key];
  }

  public dispose() {
    this.subscription.unsubscribe();
  }

  private buildItemConsumer(key: string): FormValueAdapter<T, E> {
    return new FormValueAdapter<T, E>({
      // parent-to-child values will be set directly.
      valueSource: NEVER,
      onFormValueChange: (formValue) => {
        this.keyActivity[key] = !!formValue;
        // TODO: consider a way to prevent partial changes when initializing
        const parentFormValue = this.buildParentFormValue();
        this.parentConsumer.onFormValueChange(parentFormValue);
      },
    });
  }

  private transferValueToItems(value: Record<string, T>) {
    // First, notify children based on the incoming value
    toPairs(this.itemAdapters).forEach(([key, adapter]) => {
      if (!this.keyActivity[key]) {
        return;
      }
      if (key in value) {
        adapter.setValue(value[key]);
      } else {
        // Don't let "omitted" items (whose values are not updated) be forgotten
        this.omittedItemSubject.next(key);
      }
    });
    // Also notify of "new" items (in value but not active)
    toPairs(value).forEach(([key, itemValue]) => {
      if (!this.keyActivity[key]) {
        this.newItemSubject.next({ key, itemValue });
      }
    });
  }

  private buildParentFormValue():
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
}
