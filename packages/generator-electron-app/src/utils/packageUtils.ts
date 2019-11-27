import path from 'path';
import yoenv from 'yeoman-environment';
import { run, exec, createTempDir } from './shellUtils';

export const MAGIC_DEFAULT_SCOPE: string = '@@';
export const DEFAULT_SCOPE: string = '@mono';

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

/**
 * @param {string} name The package name
 * @return {string} The fixed package name
 */
export function normalize(name: string): string {
  let { packageScope, packageName } = splitName(name);

  // user provided foo/bar instead of @foo/bar
  if (packageScope && packageScope[0] !== '@') {
    packageScope = `@${packageScope}`;
  }
  // user provided e.g. @@/foo instead of @mono/foo
  if (packageScope === MAGIC_DEFAULT_SCOPE) {
    packageScope = DEFAULT_SCOPE;
  }

  return joinName({ packageScope, packageName });
}

/**
 * Takes a package name and returns an object with explicit `packageScope` and `packageName` properties.
 */
export function splitName(name: string): PackageDescriptor {
  let packageName = '';
  let packageScope = '';
  if (name) {
    [packageScope, packageName] = name.split('/');
    if (packageScope && !packageName) {
      packageName = packageScope;
      packageScope = '';
    }
  }
  return { packageName, packageScope };
}

/**
 * Takes a `{packageName, packageScope}` object and returns a regular package name
 * @param {object} options
 * @param {string} options.packageScope
 * @param {string} options.packageName
 */
export function joinName({ packageName, packageScope }: PackageDescriptor): string {
  if (!packageName) {
    throw new Error('packageName is required');
  }
  if (packageScope) {
    return `${packageScope}/${packageName}`;
  }
  return packageName;
}

/**
 * Injects the `generator-` prefix to a package name if it's missing.
 *
 * @param {string} name A package name
 * @param {string} [PREFIX='generator-'] The prefix to ensure
 * @return {string} a generator name suitable for usage with yeoman
 */
export function getGeneratorPackageName(name: string, PREFIX: string = 'generator-'): string {
  let { packageScope, packageName } = splitName(name);

  packageName = packageName.startsWith(PREFIX) ? packageName : `${PREFIX}${packageName}`;

  return normalize(joinName({ packageScope, packageName }));
}

/**
 * Removes the `generator-` prefix from a package name.
 *
 * @param {string} name A package name
 * @param {string} [PREFIX='generator-'] The prefix to remove
 * @return {string} a regular package name
 */
export function getGeneratorYoName(name: string, PREFIX: string = 'generator-'): string {
  name = getGeneratorPackageName(name);
  name = name.replace(PREFIX, '');
  return name;
}

export function getGeneratorNames(name: string): GeneratorDescriptor {
  const packageName = getGeneratorPackageName(name);
  const yoName = getGeneratorYoName(name);
  return {
    yoName,
    packageName
  };
}

/**
 *
 * @param {string} generatorName The name of the generator package
 * @param {array} generatorArgs An array of string arguments for the generator
 * @param {*} yo A yeoman environment created via `require('yeoman-environment').createEnv()`
 */
export function runGenerator(generatorName: string, generatorArgs: string[] = [], yo: yoenv): Promise<unknown | Error> {
  return new Promise((resolve, reject) => {
    try {
      yo.lookup(() => yo.run([generatorName, ...generatorArgs], resolve));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Returns the resolved path of an installed package.
 * @param {string} name The name of the package in question
 * @return {string|null} path to installed package
 */
export async function resolvePackagePath(name: string): Promise<string | null> {
  try {
    const jsonPath = require.resolve(`${name}/package.json`);
    const packagePath = path.dirname(jsonPath);
    return packagePath;
  } catch (err) {
    return null;
  }
}

/**
 * Returns the resolved path of an installed package.
 * @param {string} name The name of the package in question
 * @return {string|null} path to installed package
 */
export async function isPackageInstalled(name: string): Promise<boolean> {
  const packagePath = await resolvePackagePath(name);
  return packagePath !== null;
}

/**
 * Installs a given package globally.
 * If the package is already installed, it won't be installed again unless the `force` flag was set.
 * @param {string} name The name of the package to install. May contain a specific version.
 * @param {boolean} force Whether to install the package again even when it is already installed
 */
export async function installPackage(name: string, force: boolean): Promise<void | Error> {
  if (!force && (await isPackageInstalled(name))) {
    console.log(`>> package ${name} is already installed`);
    return;
  }

  console.log(`>> install package ${name}`);
  await run(`npm install --global ${name}`);
}

export function joinAuthor({ authorName, authorEmail }: AuthorDescriptor): string {
  if (authorName && authorEmail) {
    return `${authorName} <${authorEmail}>`;
  }
  return authorName;
}

export async function downloadPackage(name: string): Promise<string | null> {
  const dir = createTempDir(name);

  const { stdout: packLog } = await exec(`cd ${dir} && npm pack ${name}`);

  const filename = packLog
    .split('/')
    .pop()
    .trim();

  if (filename) {
    await exec(`cd ${dir} && tar -zxvf ${filename}`);
    return dir;
  }

  return null;
}
