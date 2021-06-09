import { Handler } from "./Handler";
import { Mapper } from "./Mapper";

export function filterHandler<T>(
  handler: Handler<T>,
  filterPredicate: Mapper<T, boolean> | undefined,
): Handler<T> {
  return (value: T) => {
    if (!filterPredicate || filterPredicate(value)) {
      handler(value);
    }
  };
}
