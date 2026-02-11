import path from "path";
import { CompilerOptions, createProgram, SourceFile, TypeChecker } from "typescript";

const defaultOptions: CompilerOptions = {
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
};

export const createFixtureProgram = (
  fixturesDir: string,
  filename: string,
  compilerOptions?: CompilerOptions,
): { sourceFile: SourceFile; typeChecker: TypeChecker } => {
  const filePath = path.join(fixturesDir, filename);
  const program = createProgram([filePath], { ...defaultOptions, ...compilerOptions });
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error(`Could not get source file: ${filePath}`);
  }
  return { sourceFile, typeChecker: program.getTypeChecker() };
};
