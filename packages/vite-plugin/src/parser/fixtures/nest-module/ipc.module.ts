import { CounterController } from "./counter.controller";

function Module(_opts: { providers: (typeof CounterController)[] }): (target: typeof IpcModule) => void {
  return () => undefined;
}

@Module({
  providers: [CounterController],
})
export class IpcModule {}
