import React from 'react';
import path from 'path';
import * as NodePty from 'node-pty';
import treeKill from 'tree-kill';
import { platform } from 'os';
import { defaults } from '../utils/pty-process-manager';
/**
 * Creates a pty controller and returns it.
 */
export function usePty(hookOptions = {}) {
    const [pty, setPty] = React.useState(null);
    /**
     * Creates the child process
     */
    const { current: createPty } = React.useRef(function createPty(options) {
        const ptyOptions = Object.assign(Object.assign({}, defaults), options);
        return NodePty.spawn(ptyOptions.shell, [], {
            cols: ptyOptions.cols,
            rows: ptyOptions.rows,
            env: Object.assign(Object.assign({}, process.env), ptyOptions.env),
            cwd: ptyOptions.cwd && path.resolve(ptyOptions.cwd)
        });
    });
    const kill = React.useCallback(function kill(signal = platform() === 'win32' ? undefined : 'SIGKILL') {
        if (pty) {
            treeKill(pty.pid, signal);
            setPty(null);
        }
    }, [pty]);
    const execute = React.useCallback(function execute(command, options) {
        let p = pty;
        if (p && options) {
            kill();
        }
        if (!p || options) {
            p = createPty(options);
            setPty(p);
        }
        if (!p) {
            throw new Error('Unable to execute - child process unavailable');
        }
        p.write(command);
        p.write('\n');
    }, [pty]);
    const abort = React.useCallback(function abort() {
        if (pty) {
            pty.write('\x03');
            pty.write('\n');
        }
    }, [pty]);
    const chdir = React.useCallback(function chdir(cwd) {
        if (pty) {
            pty.write(`cd ${path.resolve(cwd)}`);
            pty.write('\n');
        }
    }, [pty]);
    React.useEffect(() => {
        if (hookOptions.eager) {
            setPty(createPty(hookOptions.ptyOptions));
        }
    }, [pty]);
    React.useEffect(() => {
        if (hookOptions.resilient) {
            return () => null;
        }
        return () => {
            kill();
        };
    }, []);
    return { pty, execute, kill, abort, chdir };
}
//# sourceMappingURL=use-pty.js.map