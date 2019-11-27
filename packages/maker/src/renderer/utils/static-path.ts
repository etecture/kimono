import path from 'path';
import * as url from 'url';

/**
 * Takes a relative file path to an asset in the static folder and returns a usable path or URL for the current env.
 * - in production: an absolute filesystem path to the bundled file inside the asar archive
 * - in development: a url to the file hosted on the local dev server
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
 * @param {string} resourcePath - filepath relative to `/static`
 * @return {string} - filepath that can be required
 */
export default function staticPath(resourcePath: string): string {
  if (process.env.NODE_ENV === 'production') {
    return path.resolve(__static, resourcePath);
  }
  return url.resolve(window.location.origin, resourcePath);
}
