export const IPC_CONTRACT_CHANNEL = "ipc_controller_contract" as const;
export const IPC_DEFAULT_API_ROOT = "ipc" as const;

export const IPC_DECORATOR_ON = "IpcOn" as const;
export const IPC_DECORATOR_ONCE = "IpcOnce" as const;
export const IPC_DECORATOR_HANDLE = "IpcHandle" as const;
export const IPC_DECORATOR_HANDLE_ONCE = "IpcHandleOnce" as const;

export const IPC_METHOD_DECORATOR_NAMES = [
  IPC_DECORATOR_HANDLE,
  IPC_DECORATOR_ON,
  IPC_DECORATOR_HANDLE_ONCE,
  IPC_DECORATOR_ONCE,
] as const;

export const IPC_PARAM_INJECTION_DECORATOR_NAMES = [
  "Channel",
  "CorrelationId",
  "Origin",
  "ProcessId",
  "RawEvent",
  "Sender",
  "Window",
] as const;
