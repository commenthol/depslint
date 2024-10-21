import debug from 'debug'

const name = 'depslint'

export const logger = (namespace = '') => ({
  debug: debug(`${name}${namespace}`)
})
