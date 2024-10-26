import { logger } from './logger.js'

/** @typedef {import('./depcheck.js').Unused} Unused */

const log = logger(':cli-tool')

/**
 * list of cross-env tools
 */
const crossEnvTools = ['cross-env']

/**
 * command map of package cli's
 * `Record<cli, package>`
 * @type {Record<string, string>}
 */
const cmdMap = {
  babel: '@babel/cli',
  c4u: 'check4updates',
  'npm-run-all': 'npm-run-all2',
  'run-p': 'npm-run-all2',
  'run-s': 'npm-run-all2',
  tsc: 'typescript'
}

/**
 * @param {string} pckg
 * @returns {string}
 */
const getCmd = (pckg) => cmdMap[pckg] || pckg

/**
 * @param {string[]} args
 * @param {Set} found
 */
const detect = (args, found) => {
  if (!args[0]) return

  let isNode = false
  for (let i = 0; i < args.length; i++) {
    const arg = (args[i] || '').trim()
    if (i === 0 && arg === 'node') {
      isNode = true
      continue
    }
    const isEnvVar = /^[^=]{1,100}=.*$/i.test(arg)
    if (isEnvVar) {
      continue
    }
    if (isNode) {
      if (['-r', '--register'].includes(arg)) {
        i++
        found.add(getCmd(args[i]))
      }
      continue
    }
    if (crossEnvTools.includes(arg)) {
      found.add(getCmd(arg))
      continue
    }
    // do not include scripts
    if (arg[0] === '.') {
      return
    }
    found.add(getCmd(arg))
    return
  }
}

/**
 * @param {string[]} scripts
 * @returns {Set<string>|undefined}
 */
export const detectCliTools = (scripts) => {
  const found = new Set()
  if (!scripts?.length) {
    return
  }
  for (const script of scripts) {
    script.split(/&&|;/).forEach((cmd) => {
      const args = cmd.trim().split(/\s/)
      detect(args, found)
    })
  }
  log.debug('scripts=', scripts)
  log.debug('found=', found)
  return found
}

/**
 * depcheck does not reliably detect packages in package.json scripts;
 * unused devDependencies which are used in scripts are removed from the list.
 * @param {object} packageJson
 * @param {Unused} unused
 * @returns {Unused}
 */
export const ignoreScriptCli = (packageJson, unused) => {
  const { devDependencies } = unused
  const { scripts } = packageJson
  if (!devDependencies || !scripts) {
    return unused
  }
  const foundCliTools = detectCliTools(Object.values(scripts))
  for (const dep of devDependencies) {
    if (foundCliTools?.has(dep)) {
      devDependencies.delete(dep)
    }
  }

  return unused
}
