import path from 'path'
import depcheck from 'depcheck'
import { isString, toRegExp } from './utils.js'
import { logger } from './logger.js'
import { DETECT_DEV_FILES, IGNORE_PCKS } from './constants.js'

const log = logger(':depcheck')

/**
 * @param {string} dirname
 * @param {object} packageJson
 * @returns {Promise<depcheck.Results>}
 */
export const dependencyCheck = async (dirname, packageJson) => {
  const options = { package: packageJson }
  const check = await depcheck(dirname, options)
  return check
}

/**
 * @typedef {object} CheckResults
 * @property {depcheck.Results} [all]
 * @property {depcheck.Results} [src]
 * @property {depcheck.Results} [test]
 * @property {object} paths
 * @property {string} paths.dirname
 * @property {string} [paths.src]
 * @property {string} [paths.test]
 */

/**
 * @param {{
 *  dirname: string
 *  packageJson: object
 *  src?: string | boolean
 *  test?: string | boolean
 * }} options
 * @returns {Promise<CheckResults>}
 */
export const runChecks = async (options) => {
  const { dirname, packageJson, src, test } = options
  const checks = {
    paths: {
      dirname
    }
  }

  const hasSrc = isString(src)
  const hasTest = isString(test)

  if (hasSrc) {
    const pathname = path.resolve(dirname, '' + src)
    checks.paths.src = pathname
    checks.src = await dependencyCheck(pathname, packageJson)
  }
  if (hasTest) {
    const pathname = path.resolve(dirname, '' + test)
    checks.paths.test = pathname
    checks.test = await dependencyCheck(pathname, packageJson)
  }
  if (!hasSrc && !hasTest) {
    checks.all = await dependencyCheck(dirname, packageJson)
  }
  log.debug('%j', checks)

  return checks
}

/**
 * returns true if all found files match detectTestFiles
 * @param {string[]} foundInFiles
 * @param {object} options
 * @param {string} options.dirname
 * @param {RegExp} options.detectTestFiles
 * @returns {boolean}
 */
const detectDevDependency = (foundInFiles, options) => {
  const { dirname, detectTestFiles } = options || {}
  const isDevDep = foundInFiles.every((found) => {
    const relative = path.relative(dirname, found)
    return detectTestFiles.test(relative)
  })
  return isDevDep
}

/**
 * @typedef {object} Missing
 * @property {boolean} change
 * @property {Set<string>} dependencies
 * @property {Set<string>} devDependencies
 */
/**
 * @typedef {Missing} Unused
 */

/**
 * obtain missing dependencies
 * @param {CheckResults} checks
 * @param {string[]} [ignoreDevFiles]
 * @returns {Missing}
 */
export const missingDeps = (checks, ignoreDevFiles) => {
  const { paths, all, src, test } = checks
  const missing = {
    change: false,
    dependencies: new Set(),
    devDependencies: new Set()
  }

  const detectTestFiles = toRegExp(DETECT_DEV_FILES, ignoreDevFiles)

  const findMissing = (
    missingCheck,
    dirname,
    { wantDep = false, wantDevDep = false }
  ) => {
    for (const [packageName, foundInFiles] of Object.entries(
      missingCheck || {}
    )) {
      const isDevDep = detectDevDependency(foundInFiles, {
        dirname,
        detectTestFiles
      })
      if (wantDevDep && isDevDep) {
        missing.change = true
        missing.devDependencies.add(packageName)
      } else if (wantDep) {
        missing.change = true
        missing.dependencies.add(packageName)
      }
    }
  }

  if (all?.missing) {
    findMissing(all.missing, paths.dirname, {
      wantDep: true,
      wantDevDep: true
    })
  }
  if (src?.missing) {
    findMissing(src.missing, paths.src, { wantDep: true })
  }
  if (test?.missing) {
    findMissing(test.missing, paths.test, { wantDevDep: true })
  }

  return missing
}

/**
 * @param {CheckResults} checks
 * @param {string[]} [ignores]
 * @returns {Unused}
 */
export const unusedDeps = (checks, ignores) => {
  const { all, src } = checks

  const ignoresRe = toRegExp(IGNORE_PCKS, ignores)

  const unused = {
    change: false,
    dependencies: new Set(),
    devDependencies: new Set()
  }

  const dependencies = all?.dependencies || src?.dependencies
  const devDependencies = all?.devDependencies

  if (dependencies?.length) {
    for (const dep of dependencies) {
      if (!ignoresRe.test(dep)) {
        unused.change = true
        unused.dependencies.add(dep)
      }
    }
  }

  if (devDependencies?.length) {
    for (const dep of devDependencies) {
      if (!ignoresRe.test(dep)) {
        unused.change = true
        unused.devDependencies.add(dep)
      }
    }
  }

  return unused
}

/**
 * @param {object} packageJson
 * @param {Missing} missing
 * @param {Unused} unused
 * @returns {object}
 */
export const changePackageJson = (packageJson, missing, unused) => {
  for (const dep of missing.dependencies.values()) {
    packageJson.dependencies = packageJson.dependencies || {}
    packageJson.dependencies[dep] = '*'
  }
  for (const dep of missing.devDependencies.values()) {
    packageJson.devDependencies = packageJson.devDependencies || {}
    packageJson.devDependencies[dep] = '*'
  }
  for (const dep of unused.dependencies.values()) {
    Reflect.deleteProperty(packageJson.dependencies || {}, dep)
  }
  for (const dep of unused.devDependencies.values()) {
    Reflect.deleteProperty(packageJson.devDependencies || {}, dep)
  }
  return packageJson
}
