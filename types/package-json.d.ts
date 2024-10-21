export function readJson(filename: string): Promise<any>;
export function writeJson(filename: string, data: any): Promise<void>;
export function readPackageJson(dirname: string): Promise<object>;
export function writePackageJson(dirname: string, data: object): Promise<void>;
