import { CounterController } from "./counter.controller";
import { IpcModule } from "./ipc.module";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createIpcApp(arg0: { controllers: unknown[] }) {
  throw new Error("Function not implemented.");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getIpcControllersFromModule(_module: new (...args: unknown[]) => unknown): unknown[] {
  return [CounterController];
}

createIpcApp({
  controllers: getIpcControllersFromModule(IpcModule) as (typeof CounterController)[],
});
