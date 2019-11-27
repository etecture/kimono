"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { spawn } = require('child_process');
const util = require('util');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
exports.exec = util.promisify(require('child_process').exec);
function run(cmd, args = { stdio: 'inherit', shell: true }) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args);
        child.on('exit', function (code, signal) {
            if (code > 0 || signal) {
                reject(new Error(`Child process exited with ${code || signal}`));
            }
            else {
                resolve();
            }
        });
    });
}
exports.run = run;
function createTempDir(name) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `${name.replace(/\//g, '--')}--`));
    return path.resolve(tempDir);
}
exports.createTempDir = createTempDir;
//# sourceMappingURL=shellUtils.js.map