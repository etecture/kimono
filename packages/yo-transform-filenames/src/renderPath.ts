import ejs from 'ejs';
import Path from 'path';

import { ParsedPath } from 'gulp-rename';
import { normalizeSyntax } from './normalize';

export interface RenderedPath extends ParsedPath {
  ignore: boolean;
}

/**
 * Takes a `ParsedPath` object and renders each of its values using the EJS templating engine
 * In case a value resolved falsy, it will be replaced by an empty string.
 *
 * @param path - The `{dirname, basename, extname}` object representing a file
 * @param context - An object with key/value pairs of template variables to use
 * @param options - EJS rendering options
 */
export function renderPath(
  candidate: string,
  context: Record<string, unknown>,
  options: Record<string, unknown> = {}
): RenderedPath {
  const original = parsePath(candidate);
  const rendered = ejs.render(normalizeSyntax(candidate), context, options);
  const parsed = parsePath(rendered);
  const ignore = isFalsy(parsed);

  return { ignore, ...(ignore ? original : parsed) };
}

export function isFalsy(path: ParsedPath): boolean {
  return ['false', 'undefined', 'null', '0'].some(value => {
    if (path.dirname) {
      if (path.dirname === value) {
        return true;
      }
      if (path.dirname.includes(`/${value}`) || path.dirname.includes(`\\${value}`)) {
        return true;
      }
    }
    if (path.basename === value) {
      return true;
    }
    return false;
  });

  // if (falsyValues.some(falsyValue => {

  //     if (path.dirname && path.dirname.includes(`${Path.sep}${falsyValue}${Path.sep}`))) {
  //         return true;
  //     }
  //     if (path.basename && path.basename.endsWith(falsyValue)) {
  //         return true;
  //     }
  // }) {
  //     return false;
  // }
  // if (falsyValues)
  // return value ? falsyValues.some(falsyValue => value.endsWith(falsyValue)) : false;
}

// copied internal function from gulp-rename
export function parsePath(path: string): ParsedPath {
  const extname = Path.extname(path);
  const dirname = Path.dirname(path);
  const basename = Path.basename(path, extname);

  return {
    dirname,
    basename,
    extname
  };
}
