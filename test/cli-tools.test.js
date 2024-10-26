import assert from 'assert'
import { detectCliTools } from '../src/cli-tools.js'

describe('detectCliTools', function () {
  it('shall detect tools', function () {
    const scripts = {
      nodeRegister:
        'node -r @short/register ./build/component.js > ./dist/component.json && node --register @long/register ./build/component.js ./index.d.tmpl > ./dist/index.d.ts',
      compile: 'babel src/ -d dist/',
      depcheck: 'node ./bin/depcheck.js --ignore-dirs=fake_modules',
      prepublishOnly: 'npm run compile && npm run component',
      prettier: 'prettier "**/*.@(js|json|md|yml)"',
      lint: 'eslint ./src ./build ./test',
      test: 'mocha ./test ./test/special --timeout 10000',
      'test-coverage':
        'cross-env NODE_ENV=test nyc mocha ./test ./test/special --timeout 20000 && nyc report --reporter=text-lcov > ./coverage/coverage.lcov',
      envVar: 'DEBUG=* FOO=bar foo; NODE_ENV=production bar'
    }

    const result = detectCliTools(Object.values(scripts))
    assert.deepEqual(
      result,
      new Set([
        '@babel/cli',
        '@long/register',
        '@short/register',
        'bar',
        'cross-env',
        'eslint',
        'foo',
        'mocha',
        'npm',
        'nyc',
        'prettier'
      ])
    )
  })
})
