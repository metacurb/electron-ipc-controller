function IpcController(): (target: typeof CounterController) => void | typeof CounterController {
  throw new Error("Function not implemented.");
}

function IpcHandle<T extends (...args: any[]) => any>(
  _name?: string,
): (
  target: CounterController,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) => void | TypedPropertyDescriptor<T> {
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

type ListModel = {
  id: string;
  title: string;
};

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

  @IpcHandle()
  noReturnType() {
    return 1;
  }

  @IpcHandle()
  getInferredList() {
    const list: ListModel[] = [];
    return list;
  }
}
