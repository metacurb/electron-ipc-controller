import { CounterController } from "./counter.controller";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createIpcApp(arg0: { controllers: (typeof CounterController)[] }) {
  throw new Error("Function not implemented.");
}

createIpcApp({
  controllers: [CounterController],
});
