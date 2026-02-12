module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@electron-ipc-bridge/shared$": "<rootDir>/../shared/src/index.ts",
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],

  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        useESM: true,
      },
    ],
  },
};
