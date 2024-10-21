import fsp from 'fs/promises'
import path from 'path'

/**
 * @param {string} filename
 * @returns {Promise<any>}
 */
export const readJson = async (filename) => {
  const content = await fsp.readFile(filename, 'utf-8')
  return JSON.parse(content)
}

/**
 * @param {string} filename
 * @param {any} data
 * @returns {Promise<void>}
 */
export const writeJson = async (filename, data) => {
  const content = JSON.stringify(data, null, 2) + '\n'
  await fsp.writeFile(filename, content, 'utf-8')
}

/**
 * @param {string} dirname
 * @returns {string}
 */
const getPackageJsonFilename = (dirname) => path.join(dirname, 'package.json')

/**
 * @param {string} dirname
 * @returns {Promise<object>}
 */
export const readPackageJson = (dirname) => {
  const filename = getPackageJsonFilename(dirname)
  return readJson(filename)
}

/**
 * @param {string} dirname
 * @param {object} data
 * @returns {Promise<void>}
 */
export const writePackageJson = (dirname, data) => {
  const filename = getPackageJsonFilename(dirname)
  return writeJson(filename, data)
}
