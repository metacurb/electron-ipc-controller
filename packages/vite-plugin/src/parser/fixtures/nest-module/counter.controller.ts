function IpcController(): (target: typeof CounterController) => void | typeof CounterController {
  throw new Error("Function not implemented.");
}

function IpcHandle(
  _name?: string,
): (
  target: CounterController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<() => number>,
) => void | TypedPropertyDescriptor<() => number> {
  throw new Error("Function not implemented.");
}

function IpcOn(
  _name?: string,
): (
  target: CounterController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<() => void>,
) => void | TypedPropertyDescriptor<() => void> {
  throw new Error("Function not implemented.");
}

@IpcController()
export class CounterController {
  @IpcHandle()
  getCount(): number {
    return 0;
  }

  @IpcHandle("inc")
  increment(amount: number = 1): number {
    return amount;
  }

  @IpcOn()
  reset(): void {
    // fire and forget
  }
}
