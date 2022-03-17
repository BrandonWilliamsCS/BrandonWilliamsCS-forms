import { isEqual } from "lodash";
import { map, Observable, Subject } from "rxjs";

export class KeyedItemComposition<T> {
  private changeSubject = new Subject<CompositionChange<T>>();
  private currentComposition: ChildItem<T>[];

  public readonly compositions = this.changeSubject.pipe(
    map((change) => change.newComposition),
  );

  public get composition() {
    return this.currentComposition;
  }

  public get changes(): Observable<CompositionChange<T>> {
    return this.changeSubject;
  }

  public constructor(initialComposition: ChildItem<T>[] = []) {
    this.currentComposition = initialComposition;
  }

  setItems(newComposition: ChildItem<T>[]) {
    if (
      isEqual(
        newComposition.map((item) => item.key),
        this.currentComposition.map((item) => item.key),
      )
    ) {
      return;
    }
    const droppedKeys = this.currentComposition
      .map((item) => item.key)
      .filter(
        (key) => !newComposition.some((nextItem) => nextItem.key === key),
      );
    this.currentComposition = newComposition;
    this.changeSubject.next({ newComposition, droppedKeys });
  }

  appendItem(key: string, value: T) {
    this.setItems([...this.currentComposition, { key, value }]);
  }

  removeItem(key: string) {
    this.setItems(this.currentComposition.filter((pair) => pair.key !== key));
  }
}

export interface CompositionChange<T> {
  newComposition: ChildItem<T>[];
  droppedKeys: string[];
}

export interface ChildItem<T> {
  key: string;
  value: T;
}
