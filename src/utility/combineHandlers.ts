import { Handler } from "./Handler";

/** Produces a handler that applies another two in sequence */
export function combineHandlers<T>(
  first: Handler<T> | undefined,
  second: Handler<T> | undefined,
): Handler<T> {
  return (t) => {
    first?.(t);
    second?.(t);
  };
}
