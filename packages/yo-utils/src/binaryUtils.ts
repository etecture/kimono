// ---------------------------------------------------------------------------------------
//
// This module provides utils for dealing with binary template files (e.g. images)
//
// binary files throw errors when copied via copyTpl
// they are treated as ejs templates and fail parsing
// see https://github.com/SBoudrias/mem-fs-editor/issues/65
// so we exclude them from fs.copyTpl, then manually fs.copy them
// this module provides helpers for doing that
//
// ---------------------------------------------------------------------------------------

import path from 'path';
import glob from 'glob';
import binaryExtensions from 'binary-extensions';

const knownBinaryExtensions = [...binaryExtensions, 'eps'];

/**
 * Returns a list of binary files in a given folder
 * @param dir path to the template source
 * @param ignoreExtensions array of file extensions to ignore
 */
export function getBinaryFiles(dir: string, ignoreGlobs?: string[] | Set<string>): string[] {
  return glob.sync(`**/*.{${knownBinaryExtensions.join(',')}}`, {
    cwd: path.resolve(dir),
    ignore: ignoreGlobs && [...ignoreGlobs]
  });
}

export function getBinaryIgnoreGlobs(files: string[]): Set<string> {
  const globs = files.map(file => `**/*${path.extname(file)}`);
  // using Set to drop duplicates from the array
  return new Set(globs);
}
