export function dependencyCheck(dirname: string, packageJson: object): Promise<depcheck.Results>;
export function runChecks(options: {
    dirname: string;
    packageJson: object;
    src?: string | boolean;
    test?: string | boolean;
}): Promise<CheckResults>;
export function missingDeps(checks: CheckResults, ignoreDevFiles?: string[] | undefined): Missing;
export function unusedDeps(checks: CheckResults, ignores?: string[] | undefined): Unused;
export function changePackageJson(packageJson: object, missing: Missing, unused: Unused): object;
export type CheckResults = {
    all?: depcheck.Results | undefined;
    src?: depcheck.Results | undefined;
    test?: depcheck.Results | undefined;
    paths: {
        dirname: string;
        src?: string | undefined;
        test?: string | undefined;
    };
};
export type Missing = {
    change: boolean;
    dependencies: Set<string>;
    devDependencies: Set<string>;
};
export type Unused = Missing;
import depcheck from 'depcheck';
