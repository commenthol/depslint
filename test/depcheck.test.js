import assert from 'assert'
import { fileURLToPath } from 'url'
import {
  missingDeps,
  unusedDeps,
  runChecks,
  changePackageJson
} from '../src/depcheck.js'

const dirname = '/Volumes/my/mypackage'
const checksAll = {
  paths: {
    dirname
  },
  all: {
    dependencies: ['foo', 'bar'],
    devDependencies: ['@types/node', 'rimraf'],
    missing: {
      express: [dirname + '/test/foo.test.js'],
      cookie: [dirname + '/src/depcheck.js'],
      debug: [dirname + '/src/logger.js']
    },
    using: {
      globals: [dirname + '/eslint.config.js'],
      'eslint-plugin-prettier': [dirname + '/eslint.config.js'],
      eslint: [dirname + '/eslint.config.js', dirname + '/package.json'],
      'eslint-config-prettier': [dirname + '/eslint.config.js'],
      c8: [dirname + '/package.json'],
      mocha: [dirname + '/package.json'],
      'npm-run-all2': [dirname + '/package.json'],
      typescript: [dirname + '/package.json'],
      express: [dirname + '/test/foo.test.js'],
      depcheck: [dirname + '/src/depcheck.js'],
      debug: [dirname + '/src/logger.js']
    }
  }
}

const checksSrc = {
  paths: {
    dirname: dirname + '',
    src: dirname + '/src'
  },
  src: {
    dependencies: ['foo', 'bar'],
    devDependencies: [
      '@types/node',
      'c8',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'globals',
      'mocha',
      'npm-run-all2',
      'rimraf',
      'typescript'
    ],
    missing: {
      cookie: [dirname + '/src/depcheck.js'],
      debug: [dirname + '/src/logger.js']
    },
    using: {
      depcheck: [dirname + '/src/depcheck.js'],
      debug: [dirname + '/src/logger.js']
    }
  }
}

const checkTest = {
  paths: {
    dirname: dirname + '',
    test: dirname + '/test'
  },
  test: {
    dependencies: ['foo', 'bar'],
    devDependencies: [
      '@types/node',
      'c8',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'globals',
      'mocha',
      'npm-run-all2',
      'rimraf',
      'typescript'
    ],
    missing: {
      express: [dirname + '/test/foo.test.js']
    },
    using: {
      express: [dirname + '/test/foo.test.js']
    }
  }
}

describe('depcheck', function () {
  describe('missingDeps', function () {
    it('shall find missing dependencies in all folders', function () {
      const expected = {
        change: true,
        dependencies: new Set(['cookie', 'debug']),
        devDependencies: new Set(['express'])
      }
      const actual = missingDeps(checksAll)
      assert.deepEqual(actual, expected)
    })

    it('shall find missing dependencies in src folder', function () {
      const expected = {
        change: true,
        dependencies: new Set(['cookie', 'debug']),
        devDependencies: new Set([])
      }
      const actual = missingDeps(checksSrc)
      assert.deepEqual(actual, expected)
    })

    it('shall find missing dependencies in test folder', function () {
      const expected = {
        change: true,
        dependencies: new Set([]),
        devDependencies: new Set(['express'])
      }
      const actual = missingDeps(checkTest)
      assert.deepEqual(actual, expected)
    })

    it('shall find missing dependencies in src and test folder', function () {
      const expected = {
        change: true,
        dependencies: new Set(['cookie', 'debug']),
        devDependencies: new Set(['express'])
      }
      const check = {
        ...checksSrc,
        ...checkTest,
        paths: { ...checksSrc.paths, ...checkTest.paths }
      }
      const actual = missingDeps(check)
      assert.deepEqual(actual, expected)
    })
  })

  describe('unusedDeps', function () {
    it('shall find unused packages', function () {
      const expected = {
        change: true,
        dependencies: new Set(['foo', 'bar']),
        devDependencies: new Set(['rimraf'])
      }
      const actual = unusedDeps(checksAll)
      assert.deepEqual(actual, expected)
    })

    it('shall find unused packages in src', function () {
      const expected = {
        change: true,
        dependencies: new Set(['foo', 'bar']),
        devDependencies: new Set([])
      }
      const actual = unusedDeps(checksSrc)
      assert.deepEqual(actual, expected)
    })

    it('shall not find unused packages in test', function () {
      const expected = {
        change: false,
        dependencies: new Set([]),
        devDependencies: new Set([])
      }
      const actual = unusedDeps(checkTest)
      assert.deepEqual(actual, expected)
    })

    it('shall find unused packages but ignore foo and rimraf', function () {
      const expected = {
        change: true,
        dependencies: new Set(['bar']),
        devDependencies: new Set([])
      }
      const ignores = ['^rimraf$', 'foo']
      const actual = unusedDeps(checksAll, ignores)
      assert.deepEqual(actual, expected)
    })
  })

  describe('runChecks', function () {
    it('shall run', async function () {
      const dirname = fileURLToPath(new URL('..', import.meta.url))

      const actual = await runChecks({ dirname })
      assert.deepEqual(Object.keys(actual.all).sort(), [
        'dependencies',
        'devDependencies',
        'invalidDirs',
        'invalidFiles',
        'missing',
        'using'
      ])
    })
  })

  describe('changePackageJson', function () {
    it('shall apply missing dependencies', function () {
      const packageJson = {}
      const missing = {
        changed: true,
        dependencies: new Set(['foo']),
        devDependencies: new Set(['@types/foo', 'bar'])
      }
      const unused = {
        changed: false,
        dependencies: new Set(),
        devDependencies: new Set()
      }
      const actual = changePackageJson(packageJson, missing, unused)
      const expected = {
        dependencies: { foo: '*' },
        devDependencies: { '@types/foo': '*', bar: '*' }
      }
      assert.deepEqual(actual, expected)
    })

    it('shall remove unused dependencies', function () {
      const packageJson = {
        dependencies: { foo: '*', bar: '^1' },
        devDependencies: { '@types/foo': '*', bar: '*', baz: '^2' }
      }
      const missing = {
        changed: false,
        dependencies: new Set(),
        devDependencies: new Set()
      }
      const unused = {
        changed: true,
        dependencies: new Set(['foo']),
        devDependencies: new Set(['@types/foo', 'bar'])
      }
      const actual = changePackageJson(packageJson, missing, unused)
      const expected = {
        dependencies: { bar: '^1' },
        devDependencies: { baz: '^2' }
      }
      assert.deepEqual(actual, expected)
    })
  })
})
