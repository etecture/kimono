import yoenv from 'yeoman-environment';
export declare const MAGIC_DEFAULT_SCOPE: string;
export declare const DEFAULT_SCOPE: string;
export interface PackageDescriptor {
    packageName: string;
    packageScope: string;
}
export interface GeneratorDescriptor {
    yoName: string;
    packageName: string;
}
export interface AuthorDescriptor {
    authorName: string;
    authorEmail: string;
}
export declare function normalize(name: string): string;
export declare function splitName(name: string): PackageDescriptor;
export declare function joinName({ packageName, packageScope }: PackageDescriptor): string;
export declare function getGeneratorPackageName(name: string, PREFIX?: string): string;
export declare function getGeneratorYoName(name: string, PREFIX?: string): string;
export declare function getGeneratorNames(name: string): GeneratorDescriptor;
export declare function runGenerator(generatorName: string, generatorArgs: string[] | undefined, yo: yoenv): Promise<unknown | Error>;
export declare function resolvePackagePath(name: string): Promise<string | null>;
export declare function isPackageInstalled(name: string): Promise<boolean>;
export declare function installPackage(name: string, force: boolean): Promise<void | Error>;
export declare function joinAuthor({ authorName, authorEmail }: AuthorDescriptor): string;
export declare function downloadPackage(name: string): Promise<string | null>;
//# sourceMappingURL=packageUtils.d.ts.map