export default {
  moduleFileExtensions: ["js", "ts"],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [`@tybalt/test-utils/dist/setup.js`],
  rootDir: process.cwd(),
};
