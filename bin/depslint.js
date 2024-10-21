#!/usr/bin/env node

import { cli, logger, depslint } from '../src/index.js'

const log = logger(':bin')

const formatJson = ({ missing, unused }) => {
  const output = {}
  for (const [key, val] of Object.entries(missing)) {
    if (val instanceof Set && val.size) {
      output.missing = output.missing || {}
      output.missing[key] = Array.from(val)
    }
  }
  for (const [key, val] of Object.entries(unused)) {
    if (val instanceof Set && val.size) {
      output.unused = output.unused || {}
      output.unused[key] = Array.from(val)
    }
  }
  return output
}

const formatText = ({ missing, unused }) => {
  const output = []

  const list = (set) => {
    for (const pckg of set) {
      output.push(`- ${pckg}`)
    }
  }

  for (const [key, val] of Object.entries(missing)) {
    if (val instanceof Set && val.size) {
      output.push(`Missing ${key}`)
      list(val)
    }
  }
  for (const [key, val] of Object.entries(unused)) {
    if (val instanceof Set && val.size) {
      output.push(`Unused ${key}`)
      list(val)
    }
  }
  return output.join('\n')
}

const run = async () => {
  const cliOpts = cli()

  if (cliOpts.help) {
    console.log(cliOpts.help)
    return
  }
  if (cliOpts.version) {
    console.log(cliOpts.version)
    return
  }

  const result = await depslint(cliOpts)
  if (!result) {
    // no changes or package json was fixed
    return
  }

  if (cliOpts.json) {
    const output = formatJson(result)
    console.log(JSON.stringify(output, null, 2))
  } else {
    const output = formatText(result)
    console.log(output)
  }
  process.exit(1)
}

run().catch((err) => {
  console.error(err.message)
  log.debug(err)
  process.exit(1)
})
