/** @typedef {import('./cli.js').Cli} Cli */
export { cli } from './cli.js'
/** @typedef {import('./depcheck.js').CheckResults} CheckResults */
/** @typedef {import('./depcheck.js').Missing} Missing */
/** @typedef {import('./depcheck.js').Unused} Unused */
export {
  runChecks,
  missingDeps,
  unusedDeps,
  changePackageJson
} from './depcheck.js'
/** @typedef {import('./depslint.js').DepsLintOptions} DepsLintOptions */
export { depslint } from './depslint.js'
export { logger } from './logger.js'
export { readPackageJson, writePackageJson } from './package-json.js'
