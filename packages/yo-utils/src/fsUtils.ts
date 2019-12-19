import fs from 'fs-extra';
import path from 'path';
import glob, { IOptions } from 'glob';

export const forwardSlashes = (value: string) => value.replace(/\\/g, '/');

function getGlobOptions(options: IOptions = {}): IOptions {
  return {
    //----------------------------
    // DEFAULT VALUES
    //----------------------------
    // avoid call to cwd() if value was provided
    cwd: options.cwd || process.cwd(),
    // other defaults
    dot: true,
    //----------------------------
    // USER-PROVIDED VALUES
    //----------------------------
    ...options
  };
}

/**
 * Resolves a glob pattern into an array of matching files
 * @param pattern A glob pattern
 * @param globOptions Any supported [glob options](https://www.npmjs.com/package/glob#options)
 * @return Promise for an array of strings
 */
export function resolveGlob(pattern?: string, globOptions?: IOptions): Promise<string[]> {
  if (!pattern) {
    return Promise.resolve([]);
  }
  return new Promise((resolve, reject) => {
    glob(pattern, getGlobOptions(globOptions), (err, matches) => {
      if (err) {
        reject(err);
        return;
      }
      resolve([...new Set(matches)]);
    });
  });
}

/**
 * Resolves an array of glob patterns to matching filenames.
 * Always returns an array, even if it's an empty one.
 *
 * @param patterns An array of glob patterns
 * @param globOptions Any supported [glob options](https://www.npmjs.com/package/glob#options)
 * @return Promise for an array of strings
 */
export async function resolveGlobs(patterns?: string[], globOptions?: IOptions): Promise<string[]> {
  if (!patterns || !patterns.length) {
    return [];
  }

  const result: Set<string> = new Set();
  for (const pattern of patterns) {
    try {
      const matches = await resolveGlob(pattern, globOptions);
      if (matches) {
        matches.forEach(match => result.add(match));
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return [...result];
}

/**
 * Resolves a JSON file path to a parsed object.
 * @param file Absolute path to a json file
 * @return Promise for either a parsed object in case of success, or for null otherwise
 */
export async function loadJSON(file: string): Promise<Record<string, any> | null> {
  if (file && fs.existsSync(file)) {
    try {
      const json = await fs.readJSON(path.resolve(file));
      if (json) {
        return json;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return null;
}
