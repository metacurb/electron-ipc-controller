import { Constructor } from "../metadata/types";

export interface ControllerResolver {
  resolve<T>(controller: Constructor<T>): T;
}
