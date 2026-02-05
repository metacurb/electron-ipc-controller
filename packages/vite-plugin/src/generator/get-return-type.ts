export const getReturnType = (decorator: string, originalReturnType: string): string => {
  if (decorator === "IpcOn" || decorator === "IpcOnce") {
    return "void";
  }

  if (originalReturnType.startsWith("Promise<")) {
    return originalReturnType;
  }

  return `Promise<${originalReturnType}>`;
};
