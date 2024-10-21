# depslint

> A dependency linter

[![npm-badge][npm-badge]][npm]
[![actions-badge][actions-badge]][actions]
![types-badge][types-badge]

A npm dependency linter built on [depcheck][].


## Installation

    npm install -g depslint

## Usage

"source" and "test" can be optionally specified. These must be relative to "dirname" where a `package.json` file must be found.

```
  Usage: depslint [options] [directory]

  Options:
  -v, --version           Show version number
  -h, --help              Show this help message
  -s, --source [dirname]  Specify source directory
  -t, --test [dirname]    Specify test directory
  -i, --ignore [packages] Ignore unused packages
      --fix               Fix package.json in directory
      --json              JSON output if missing or removable packages are detected
```

## API

```js
import { depslint } from 'depslint'
const options = {
  cwd: process.cwd(),
  src: 'src',
  test: '',
  ignores: ['rimraf'],
  fix: true
}
const { missing, unused } = await depslint(options)
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and license.

## License

MIT License

[LICENSE]: ./LICENSE
[npm-badge]: https://badgen.net/npm/v/depslint
[npm]: https://www.npmjs.com/package/depslint
[actions-badge]: https://github.com/commenthol/depslint/actions/workflows/ci.yml/badge.svg
[actions]: https://github.com/commenthol/depslint/actions/workflows/ci.yml?query=branch%3Amain
[types-badge]: https://badgen.net/npm/types/depslint
[depcheck]: https://www.npmjs.com/package/depcheck
