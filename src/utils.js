/**
 * @param {any} any
 * @returns {boolean}
 */
export const isString = (any) => typeof any === 'string'

/**
 * @param {string[]} defaults
 * @param {string[]} [custom]
 * @returns {RegExp}
 */
export const toRegExp = (defaults, custom = []) => {
  const _custom = []
  for (let pck of custom) {
    if (!pck) continue
    if (pck[0] !== '^') {
      pck = '^' + pck
    }
    if (pck.slice(-1) !== '$') {
      pck = pck + '$'
    }
    _custom.push(pck)
  }
  let list = [..._custom, ...defaults]
  return new RegExp('(' + list.join('|') + ')')
}
