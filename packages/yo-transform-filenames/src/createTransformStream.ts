import gulpRename, { ParsedPath } from 'gulp-rename';
import { fsUtils } from '@kimono/yo-utils';
import { renderPath } from './renderPath';
import { getFilePath } from './utils';

/**
 * Creates a stream for the yo generator which will parse and render the filenames of template
 * files and folders using our adopted EJS filesystem syntax.
 *
 * @param context An object with key/value pairs that will be available as template variables
 * @param ignored An array of filenames to exclude from EJS parsing
 */
export function createTransformStream(context: {}, ignored?: string[]): NodeJS.ReadWriteStream {
  return gulpRename((path: ParsedPath) => {
    const currentFile: string = fsUtils.forwardSlashes(getFilePath(path));

    if (ignored && ignored.some(ignoredFile => currentFile === fsUtils.forwardSlashes(ignoredFile))) {
      return;
    }

    const renderedPath = renderPath(getFilePath(path), context);
    Object.assign(path, renderedPath);
  });
}
