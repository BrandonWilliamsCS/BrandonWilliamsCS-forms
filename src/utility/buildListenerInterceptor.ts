import { combineHandlers } from "./combineHandlers";
import { Handler } from "./Handler";
import { HandlerInterceptor } from "./HandlerInterceptor";

/**
 * Allows a handler to "listen" to via interception.
 * @param listener A handler that will 
 */
export function buildListenerInterceptor<T>(
  listener: Handler<T>,
): HandlerInterceptor<T> {
  return (value: T, base: Handler<T>) => combineHandlers(listener, base)(value);
}
