import { HandlerInterceptor } from "./HandlerInterceptor";

/** Produces an interceptor that applies another two in sequence */
export function combineInterceptors<T, U, V>(
  first: HandlerInterceptor<T, U>,
  second: HandlerInterceptor<U, V>,
): HandlerInterceptor<T, V> {
  return (t, base) => {
    first(t, (u) => {
      second(u, (v) => {
        base(v);
      });
    });
  };
}
