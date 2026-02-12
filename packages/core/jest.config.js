module.exports = {
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@electron-ipc-bridge/shared$": "<rootDir>/../shared/src/index.ts",
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src", "<rootDir>/../shared"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: false,
        tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
        },
      },
    ],
  },
};
