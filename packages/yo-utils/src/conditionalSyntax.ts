// ---------------------------------------------------------------------------------------
//
// This module provides utils fo dealing with conditional expressions in filenames.
//
// ---------------------------------------------------------------------------------------

/**
 * Delimiters - special character sequences used in the conditional syntax
 */
export const Delimiters = {
  VARNAME_START: '%',
  BOOLEAN_AND: ' && ',
  TERNARY_AND: ' == ',
  TERNARY_OR: ' !! '
};

/**
 * The regular expression to check whether a given name contains conditional syntax
 * examples of matched filenames:
 * - %varname && foo.txt
 * - %!varname && foo.txt
 * - foo/bar/%varname && foo.txt
 * - index.%varname == .ts ## .js
 */
export const DEFAULT_CONDITIONAL_SYNTAX_REGEXP = new RegExp(
  `(.*)${Delimiters.VARNAME_START}(.*)(${Delimiters.BOOLEAN_AND}|${Delimiters.TERNARY_AND})(.*)(?:${Delimiters.TERNARY_OR})?(.*)?`
);

/**
 * Creates glob patterns for a single option (key/value pair) to include or exclude files based on the value.
 * Any template files matching the created glob will be excluded from copying.
 *
 * @param {string} key
 * @param {*} value
 * @return {array<string>} glob patterns for excluding files
 */
export const DEFAULT_CREATE_IGNORE_GLOBS = (key: string, value: unknown) => {
  const varname = value ? `!${key}` : key;
  const glob = `**/*${Delimiters.VARNAME_START}${varname}${Delimiters.BOOLEAN_AND}*`;
  return [glob, `${glob}/*`];
};

/**
 * Creates an array of globs for excluding files with boolean syntax while copying.
 * - If the value is falsy, matching names are excluded (%varname && foo.txt)
 * - If the value is truthy, negated names are excluded (%!varname && foo.txt)
 *
 * @param {*} context - An object with key/value pairs of available template variables
 * @param {*} [createGlob] - A `(key:string, value:any):string|string[]` function that takes a variable and returns a glob
 */
export function getConditionalSyntaxIgnoreGlobs(context: {}, createGlob = DEFAULT_CREATE_IGNORE_GLOBS): string[] {
  return Object.entries(context).reduce((result: string[], [key, value]) => {
    const globs = createGlob(key, value);
    return [...result, ...(Array.isArray(globs) ? globs : [globs])];
  }, []);
}
