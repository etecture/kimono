import { platform } from 'os';
import { EventEmitter } from 'events';
import * as NodePty from 'node-pty';
import treeKill from 'tree-kill';
import { toObject } from './key-value-converter';
import { createCommandString } from './create-command-string';
export const defaults = {
    shell: platform() === 'win32' ? 'bash.exe' : '/bin/bash',
    cols: 120,
    rows: 80
};
export class PtyManager extends EventEmitter {
    constructor() {
        super(...arguments);
        this.childProcessMap = {};
    }
    get(commandOrProcessId) {
        if (typeof commandOrProcessId === 'string') {
            const record = this.childProcessMap[commandOrProcessId];
            if (record) {
                return record.childProcess;
            }
        }
        if (typeof commandOrProcessId === 'number') {
            const record = Object.values(this.childProcessMap).find(record => { var _a, _b; return ((_b = (_a = record) === null || _a === void 0 ? void 0 : _a.childProcess) === null || _b === void 0 ? void 0 : _b.pid) === commandOrProcessId; });
            if (record) {
                return record.childProcess;
            }
        }
        return null;
    }
    kill(commandOrProcessId, signal = platform() === 'win32' ? undefined : 'SIGKILL') {
        if (typeof commandOrProcessId === 'string') {
            const commandId = commandOrProcessId;
            const record = this.childProcessMap[commandId];
            if (record) {
                treeKill(record.childProcess.pid, signal);
            }
        }
        if (typeof commandOrProcessId === 'number') {
            const processId = commandOrProcessId;
            treeKill(processId, signal);
        }
    }
    /**
     * Connects to an existing process or creates it, then returns it
     * @param command The command object
     * @param execute whether to automatically execute the command
     */
    connect(command, execute) {
        const childProcess = this._ensureChildProcess(command);
        if (execute) {
            this.execute(command);
        }
        return childProcess;
    }
    execute(command, options = this.createPtyOptions(command)) {
        const childProcess = this._ensureChildProcess(command, options);
        childProcess.write(createCommandString(command));
        childProcess.write('\n');
        return childProcess;
    }
    createPtyOptions(command) {
        return Object.assign(Object.assign({}, defaults), { cwd: command.cwd, env: Object.assign(Object.assign({}, process.env), toObject(command.env)) });
    }
    _ensureChildProcess(command, options = this.createPtyOptions(command)) {
        const record = this.childProcessMap[command.id];
        if (!record) {
            return this._createChildProcess(command.id, options).childProcess;
        }
        return record.childProcess;
    }
    _createChildProcess(commandId, options) {
        const ptyOptions = Object.assign(Object.assign({}, defaults), options);
        const pty = NodePty.spawn(ptyOptions.shell, [], {
            cols: ptyOptions.cols,
            rows: ptyOptions.rows,
            env: ptyOptions.env,
            cwd: ptyOptions.cwd
        });
        const record = {
            options: ptyOptions,
            childProcess: pty,
            _exitListener: pty.onExit(() => {
                record._exitListener.dispose();
                this.emit(PtyManager.EXIT, {
                    commandId,
                    processId: pty.pid
                });
                this.childProcessMap[commandId] = null;
            })
        };
        this.childProcessMap[commandId] = record;
        this.emit(PtyManager.SPAWN, {
            commandId,
            processId: pty.pid
        });
        return record;
    }
}
PtyManager.SPAWN = 'spawn';
PtyManager.EXIT = 'exit';
export const defaultPtyManager = new PtyManager();
//# sourceMappingURL=pty-process-manager.js.map