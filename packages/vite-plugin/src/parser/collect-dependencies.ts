import { ControllerMetadata } from "./types.js";

export const collectDependencies = (
  referencedTypes: ControllerMetadata["referencedTypes"],
  processedFiles: Set<string>,
) => {
  const visit = (types: typeof referencedTypes) => {
    for (const type of types) {
      if (type.sourceFile) {
        processedFiles.add(type.sourceFile);
      }
      visit(type.referencedTypes);
    }
  };
  visit(referencedTypes);
};
