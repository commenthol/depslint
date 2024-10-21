import fs from 'fs'

const help = `
  Usage: depslint [options] [directory]

  Options:
  -v, --version           Show version number
  -h, --help              Show this help message
  -s, --source [dirname]  Specify source directory
  -t, --test [dirname]    Specify test directory
  -i, --ignore [packages] Ignore unused packages
      --fix               Fix package.json in directory
      --json              JSON output if missing or unused packages are detected
`

/**
 * @typedef {object} Cli
 * @property {string} cwd working directory
 * @property {string} [help] shows help
 * @property {string} [version] shows version
 * @property {string|boolean} [src] source directory
 * @property {string|boolean} [test] test directory
 * @property {string[]} [ignores] ignore packages from removal
 * @property {boolean} fix fixes package.json
 */

/**
 * @param {string[]} [args]
 * @returns {Cli}
 */
export function cli(args) {
  const argv = args || process.argv.slice(2)
  const cliOpts = { cwd: process.cwd(), fix: false }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '-h':
      case '--help':
        cliOpts.help = help
        break
      case '-v':
      case '--version': {
        const filename = new URL('../package.json', import.meta.url)
        const packageJson = JSON.parse(fs.readFileSync(filename, 'utf-8'))
        cliOpts.version = packageJson.version
        break
      }
      case '-s':
      case '--source':
        cliOpts.src = nextArg(argv)
        break
      case '-t':
      case '--test':
        cliOpts.test = nextArg(argv)
        break
      case '-i':
      case '--ignore': {
        let pckg = nextArg(argv)
        if (!pckg) {
          break
        }
        let pckgs = pckg
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
        cliOpts.ignores = [...(cliOpts.ignores || []), ...pckgs]
        break
      }
      case '--fix':
        cliOpts.fix = true
        break
      case '--json':
        cliOpts.json = true
        break
      default:
        if (arg) cliOpts.cwd = arg
        break
    }
  }
  return cliOpts
}

function nextArg(argv, required = false) {
  const next = argv[0]
  if (typeof next !== 'string' || next.indexOf('-') === 0) {
    return required ? undefined : true
  }
  return argv.shift()
}
