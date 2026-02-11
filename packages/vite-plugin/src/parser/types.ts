import type { IpcDecoratorName } from "@electron-ipc-controller/shared";

export interface ControllerMetadata {
  className: string;
  filePath: string;
  methods: MethodMetadata[];
  namespace: string;
  referencedTypes: TypeDefinition[];
}
export interface TypeDefinition {
  definition: string;
  name: string;
  referencedTypes: TypeDefinition[];
  sourceFile: string;
}

export interface MethodMetadata {
  decoratorName: IpcDecoratorName;
  name: string;
  params: ParamMetadata[];
  referencedTypes: TypeDefinition[];
  returnType: string;
}

export interface ParamMetadata {
  name: string;
  optional: boolean;
  type: string;
}
