import Path from 'path';
import { ParsedPath } from 'gulp-rename';

export function getFilePath(filePath: ParsedPath): string {
  const dirname = filePath.dirname;
  const basename = filePath.basename;
  const dot = (filePath.extname && (filePath.extname.startsWith('.') ? '' : '.')) || '';
  const extname = (filePath.extname && `${dot}${filePath.extname}`) || filePath.extname;
  return `${dirname}${Path.sep}${basename}${extname}`;
}
