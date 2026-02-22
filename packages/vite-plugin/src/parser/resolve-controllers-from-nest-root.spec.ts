import path from "path";
import { createProgram, forEachChild, isClassDeclaration } from "typescript";

import { normalizePath } from "../normalize-path";
import { resolveControllersFromNestRoot } from "./resolve-controllers-from-nest-root";
import { ControllerMetadata } from "./types";

const fixturesDir = path.resolve(__dirname, "fixtures/nest-strategy-resolution");

const getModuleClass = (fixtureDir: string, filename: string, className: string) => {
  const filePath = path.join(fixtureDir, filename);
  const program = createProgram([filePath], {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
  });
  const typeChecker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) throw new Error(`Could not get source file: ${filePath}`);

  let found: import("typescript").ClassDeclaration | undefined;
  forEachChild(sourceFile, function visit(node) {
    if (isClassDeclaration(node) && node.name?.text === className) {
      found = node;
    }
    forEachChild(node, visit);
  });

  if (!found) throw new Error(`Class ${className} not found in ${filePath}`);
  return { classDecl: found, typeChecker };
};

describe("resolveControllersFromNestRoot", () => {
  it("resolves controllers from a root module class", () => {
    const { classDecl, typeChecker } = getModuleClass(fixturesDir, "app.module.ts", "AppModule");
    const controllers: ControllerMetadata[] = [];
    const processedFiles = new Set<string>();
    const fileCache = new Map<string, ControllerMetadata[]>();
    const visitedModules = new Set<string>();

    resolveControllersFromNestRoot(classDecl, typeChecker, processedFiles, controllers, fileCache, visitedModules);

    const classNames = controllers.map((c) => c.className);
    expect(classNames).toContain("AppController");
  });

  it("follows imports to discover controllers in child modules", () => {
    const { classDecl, typeChecker } = getModuleClass(fixturesDir, "app.module.ts", "AppModule");
    const controllers: ControllerMetadata[] = [];
    const processedFiles = new Set<string>();
    const fileCache = new Map<string, ControllerMetadata[]>();
    const visitedModules = new Set<string>();

    resolveControllersFromNestRoot(classDecl, typeChecker, processedFiles, controllers, fileCache, visitedModules);

    const classNames = controllers.map((c) => c.className);
    expect(classNames).toContain("ChildController");
  });

  it("does not revisit already-visited modules", () => {
    const { classDecl, typeChecker } = getModuleClass(fixturesDir, "app.module.ts", "AppModule");
    const controllers: ControllerMetadata[] = [];
    const processedFiles = new Set<string>();
    const fileCache = new Map<string, ControllerMetadata[]>();
    const filePath = path.join(fixturesDir, "app.module.ts");
    const normalizedPath = normalizePath(filePath);
    const visitedModules = new Set<string>([normalizedPath]);

    resolveControllersFromNestRoot(classDecl, typeChecker, processedFiles, controllers, fileCache, visitedModules);

    expect(controllers).toEqual([]);
  });
});
