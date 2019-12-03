import util from 'util';
import fs from 'fs-extra';

import path from 'path';
import os from 'os';

const { spawn } = require('child_process');
export const exec = util.promisify(require('child_process').exec);

export function run(cmd: string, args = { stdio: 'inherit', shell: true }): Promise<void | Error> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    child.on('exit', function(code: number, signal: string) {
      if (code > 0 || signal) {
        reject(new Error(`Child process exited with ${code || signal}`));
      } else {
        resolve();
      }
    });
  });
}

export function createTempDir(name: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `${name.replace(/\//g, '--')}--`));
  return path.resolve(tempDir);
}
