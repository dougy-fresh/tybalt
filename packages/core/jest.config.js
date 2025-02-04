export default {
  moduleFileExtensions: ["js", "ts"],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    "../../node_modules/@tybalt/test-utils/dist/setup.js",
    "<rootDir>/jest.setup.js",
  ],
  collectCoverageFrom: ["src/**/*.ts"],
};
