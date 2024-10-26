import path from 'path'
import { ignoreScriptCli } from './cli-tools.js'
import {
  runChecks,
  missingDeps,
  unusedDeps,
  changePackageJson
} from './depcheck.js'
import { readPackageJson, writePackageJson } from './package-json.js'

/**
 * @typedef {object} DepsLintOptions
 * @property {string} cwd working directory
 * @property {string|boolean} [src] source directory
 * @property {string|boolean} [test] test directory
 * @property {string[]} [ignores] ignore unused packages
 * @property {boolean} fix fixes package.json
 */

/**
 * @param {DepsLintOptions} options
 */
export const depslint = async (options) => {
  const { cwd, src, test, ignores, fix } = options

  const dirname = path.resolve(process.cwd(), cwd)
  const packageJson = await readPackageJson(dirname)

  const checks = await runChecks({ dirname, packageJson, src, test })
  const missing = missingDeps(checks)
  const unused = ignoreScriptCli(packageJson, unusedDeps(checks, ignores))

  if (fix) {
    changePackageJson(packageJson, missing, unused)
    await writePackageJson(dirname, packageJson)
    return
  }
  if (!missing.change && !unused.change) {
    // no changes detected
    return
  }

  return { missing, unused, checks }
}
