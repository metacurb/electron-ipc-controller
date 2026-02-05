export interface ControllerMetadata {
  className: string;
  filePath: string;
  methods: MethodMetadata[];
  namespace: string;
}

export interface MethodMetadata {
  decoratorName: "IpcHandle" | "IpcOn" | "IpcHandleOnce" | "IpcOnce";
  isAsync: boolean;
  name: string;
  params: ParamMetadata[];
  returnType: string;
}

export interface ParamMetadata {
  name: string;
  optional: boolean;
  type: string;
}
