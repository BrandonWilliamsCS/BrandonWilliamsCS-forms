import { Handler } from "./Handler";

/** Any logic that "intercepts" a handler call, which may translate, defer, etc. */
export type HandlerInterceptor<T, U = T> = (t: T, base: Handler<U>) => void;
