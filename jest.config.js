module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  silent: false,
  coveragePathIgnorePatterns: ["node_modules", "dist"],
  setupFiles: ["dotenv/config"],
  testTimeout: 15000,
};
