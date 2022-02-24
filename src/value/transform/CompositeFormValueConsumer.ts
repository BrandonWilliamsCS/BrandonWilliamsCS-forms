import { map } from "rxjs";
import { toPairs } from "lodash";
import { FormValue } from "../FormValue";
import { FormValueConsumer } from "../FormValueConsumer";
import { FormValueAdapter } from "./FormValueAdapter";
import { validityFor } from "../Validity";

export class CompositeFormValueConsumer<TParent, E> {
  private readonly childAdapters: ChildAdapterMap<TParent, E> = {};

  public constructor(
    private readonly parentConsumer: FormValueConsumer<
      TParent,
      Record<keyof TParent, E>
    >,
  ) {}

  public getChildConsumer<K extends keyof TParent>(
    key: K,
  ): FormValueAdapter<TParent[K], E> {
    if (!this.childAdapters[key]) {
      const newSource = this.buildChildConsumer(key);
      this.childAdapters[key] = newSource;
    }
    return this.childAdapters[key]!;
  }

  private buildChildConsumer<K extends keyof TParent>(
    key: K,
  ): FormValueAdapter<TParent[K], E> {
    // TODO: stop sending values when child is eliminated
    const childValueSource = this.parentConsumer.valueSource.pipe(
      map((parentValue) => parentValue[key]),
    );
    return new FormValueAdapter({
      valueSource: childValueSource,
      onFormValueChange: (formValue) => {
        // TODO: consider a way to prevent partial changes when initializing
        const parentFormValue = this.buildParentFormValue();
        this.parentConsumer.onFormValueChange(parentFormValue);
      },
    });
  }

  private buildParentFormValue():
    | FormValue<TParent, Record<keyof TParent, E>>
    | undefined {
    const parentValue = {} as TParent;
    let hasInnerErrors = false;
    const innerErrors: Record<keyof TParent, E> = {} as Record<
      keyof TParent,
      E
    >;
    const adapterPairs = toPairs(this.childAdapters) as ChildAdapterMapEntries<
      TParent,
      E
    >;
    for (const [key, childAdapter] of adapterPairs) {
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

type ChildAdapterMap<TParent, E> = {
  [K in keyof TParent]?: FormValueAdapter<TParent[K], E>;
};
type ChildAdapterMapEntries<TParent, E> = {
  [K in keyof TParent]: [K, FormValueAdapter<TParent[K], E>];
}[keyof TParent][];
