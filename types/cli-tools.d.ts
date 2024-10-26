export function detectCliTools(scripts: string[]): Set<string> | undefined;
export function ignoreScriptCli(packageJson: object, unused: Unused): Unused;
export type Unused = import("./depcheck.js").Unused;
