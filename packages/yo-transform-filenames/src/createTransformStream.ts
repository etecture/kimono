import gulpRename, { ParsedPath } from 'gulp-rename';

import { renderPath } from './renderPath';
import { getFilePath } from './utils';

export function createTransformStream(context: {}): NodeJS.ReadWriteStream {
  return gulpRename((path: ParsedPath) => {
    const filepath: string = getFilePath(path);
    Object.assign(path, renderPath(filepath, context));
  });
}
