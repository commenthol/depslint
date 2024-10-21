export { cli } from "./cli.js";
export { depslint } from "./depslint.js";
export { logger } from "./logger.js";
export type Cli = import("./cli.js").Cli;
export type CheckResults = import("./depcheck.js").CheckResults;
export type Missing = import("./depcheck.js").Missing;
export type Unused = import("./depcheck.js").Unused;
export type DepsLintOptions = import("./depslint.js").DepsLintOptions;
export { runChecks, missingDeps, unusedDeps, changePackageJson } from "./depcheck.js";
export { readPackageJson, writePackageJson } from "./package-json.js";