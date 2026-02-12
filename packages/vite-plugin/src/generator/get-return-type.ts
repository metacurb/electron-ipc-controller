import { IPC_DECORATOR_ON, IPC_DECORATOR_ONCE } from "@electron-ipc-bridge/shared";

export const getReturnType = (decorator: string, originalReturnType: string): string => {
  if (decorator === IPC_DECORATOR_ON || decorator === IPC_DECORATOR_ONCE) {
    return "void";
  }

  if (originalReturnType.startsWith("Promise<")) {
    return originalReturnType;
  }

  return `Promise<${originalReturnType}>`;
};
