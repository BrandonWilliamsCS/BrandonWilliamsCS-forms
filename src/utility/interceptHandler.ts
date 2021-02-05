import { Handler } from "./Handler";
import { HandlerInterceptor } from "./HandlerInterceptor";

/**
 * Intercept a handler function based on the provided logic.
 * Here, "intercept" means to make decisions on how and when to actually handle.
 * For example, an interceptor might filter data change events so that only
 *  numerical string values may pass through to a base. The interceptor may
 *  also actually convert that string into a number.
 * @param base A simple Handler function
 * @param interceptor The logic for intercepting the base
 */
export function interceptHandler<T, U>(
  base: Handler<U>,
  interceptor: HandlerInterceptor<T, U>,
): Handler<T> {
  return (t: T) => interceptor(t, base);
}
