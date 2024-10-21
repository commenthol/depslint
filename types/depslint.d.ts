export function depslint(options: DepsLintOptions): Promise<{
    missing: import("./depcheck.js").Missing;
    unused: import("./depcheck.js").Missing;
    checks: import("./depcheck.js").CheckResults;
} | undefined>;
export type DepsLintOptions = {
    /**
     * working directory
     */
    cwd: string;
    /**
     * source directory
     */
    src?: string | boolean | undefined;
    /**
     * test directory
     */
    test?: string | boolean | undefined;
    /**
     * ignore unused packages
     */
    ignores?: string[] | undefined;
    /**
     * fixes package.json
     */
    fix: boolean;
};
