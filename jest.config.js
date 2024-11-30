/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],  // Transpile .ts and .tsx files using ts-jest
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // Ensure this matches the alias in tsconfig.json
  },
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],  // Add src to module directories to resolve from there
  testPathIgnorePatterns: ['/dist/'],  // Avoid running tests on dist files
};

