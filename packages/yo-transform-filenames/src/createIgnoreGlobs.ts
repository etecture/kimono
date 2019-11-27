import glob from 'glob';
import { renderPath } from './renderPath';

export async function createIgnoreGlobs(dir: string, context: {}, globOptions?: {}): Promise<Set<string> | Error> {
  const candidates = glob.sync('**/*{%*', { dot: true, cwd: dir, ...globOptions });
  return candidates.reduce((result: Set<string>, candidate) => {
    const rendered = renderPath(candidate, context);
    if (rendered.ignore) {
      // we basically use the existing filenames as ignore-globs
      // however, there are problems with globs that contain quotes
      // I couldn't escape them successfully despite of considerable amount of efforts
      // as a workaround, we replace quotes with asterisks, which gets the job done too
      candidate = candidate.replace(/'/g, '*');
      result.add(`**/*${candidate}*`);
      result.add(`**/*${candidate}*/*`);
      result.add(`**/*${candidate}*/**/*`);
    }
    return result;
  }, new Set(['**/*false*', '**/*false*/*', '**/*false*/**/*']));
}
