/**
 * detect potential test files
 */
export const DETECT_DEV_FILES = [
  'test[s]?\\/',
  'spec[s]?\\/',
  'stories\\/',
  'storybook\\/',
  'script[s]?\\/',
  '\\.(?:test|spec|story|stories)\\.[a-z]{1,4}$'
]

/**
 * ignored packages from removal
 */
export const IGNORE_PCKS = ['^@types\\/[a-z_-]{1,99}$']
