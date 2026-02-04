import { Constructor } from "../metadata/types";

/**
 * Unwrap Promise type for return values
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Extract handler methods from a controller instance type
 * Excludes constructor and non-function properties
 */
type ExtractControllerMethods<T> = {
  [K in keyof T as K extends "constructor"
    ? never
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      T[K] extends (...args: infer _A) => infer _R
      ? K
      : never]: T[K] extends (...args: infer A) => infer R
    ? R extends Promise<unknown>
      ? (...args: A) => Promise<UnwrapPromise<R>>
      : R extends void
        ? (...args: A) => void
        : (...args: A) => Promise<R>
    : never;
};

/**
 * Contract mapping: namespace string -> controller class
 * Users define this to match their @Controller() decorators
 */
export type IpcContract = Record<string, Constructor>;

/**
 * Infer the complete IPC API type from a contract mapping.
 * Namespaces are explicitly defined by the user, matching their decorator usage.
 *
 * @example
 * ```typescript
 * // Define contract matching your @Controller decorators
 * const contract = {
 *   settings: SettingsController,    // @Controller() - default namespace
 *   config: ConfigController,        // @Controller("config") - custom namespace
 * } as const;
 *
 * type Api = InferIpcApi<typeof contract>;
 * // Results in: { settings: { get(), set() }, config: { load(), save() } }
 * ```
 */
export type InferIpcApi<T extends IpcContract> = {
  [K in keyof T]: ExtractControllerMethods<InstanceType<T[K]>>;
};
