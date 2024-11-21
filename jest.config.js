/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust according to your directory structure
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  preset: "ts-jest",
};

