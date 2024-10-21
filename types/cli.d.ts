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
export function cli(args?: string[] | undefined): Cli;
export type Cli = {
    /**
     * working directory
     */
    cwd: string;
    /**
     * shows help
     */
    help?: string | undefined;
    /**
     * shows version
     */
    version?: string | undefined;
    /**
     * source directory
     */
    src?: string | boolean | undefined;
    /**
     * test directory
     */
    test?: string | boolean | undefined;
    /**
     * ignore packages from removal
     */
    ignores?: string[] | undefined;
    /**
     * fixes package.json
     */
    fix: boolean;
};
