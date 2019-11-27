import { platform } from 'os';
import { EventEmitter } from 'events';

import { IDisposable } from 'xterm';
import * as NodePty from 'node-pty';
import treeKill from 'tree-kill';

import { toObject } from './key-value-converter';
import { createCommandString } from './create-command-string';
import { Command } from '../command';

export interface PtyOptions {
  shell: string;
  cols: number;
  rows: number;
  cwd?: string;
  env?: { [key: string]: string };
}

export interface PtyEvent {
  processId: number;
  commandId: string;
}

export const defaults: Partial<PtyOptions> = {
  shell: platform() === 'win32' ? 'bash.exe' : '/bin/bash',
  cols: 120,
  rows: 80
};

/** Internal interface for mapping running child processes, their options and exit listeners */
interface PtyChildRecord {
  options: PtyOptions;
  childProcess: NodePty.IPty;
  _exitListener: IDisposable;
}

export class PtyManager extends EventEmitter {
  public static SPAWN = 'spawn';
  public static EXIT = 'exit';

  private childProcessMap: {
    [commandId: string]: PtyChildRecord | null;
  } = {};

  public get(commandId: string): NodePty.IPty | null;
  public get(processId: number): NodePty.IPty | null;
  public get(commandOrProcessId: string | number): NodePty.IPty | null {
    if (typeof commandOrProcessId === 'string') {
      const record = this.childProcessMap[commandOrProcessId];
      if (record) {
        return record.childProcess;
      }
    }

    if (typeof commandOrProcessId === 'number') {
      const record = Object.values(this.childProcessMap).find(
        record => record?.childProcess?.pid === commandOrProcessId
      );
      if (record) {
        return record.childProcess;
      }
    }

    return null;
  }

  public kill(commandId: string): void;
  public kill(processId: number): void;
  public kill(commandOrProcessId: string | number, signal = platform() === 'win32' ? undefined : 'SIGKILL'): void {
    if (typeof commandOrProcessId === 'string') {
      const commandId = commandOrProcessId as string;
      const record = this.childProcessMap[commandId];
      if (record) {
        treeKill(record.childProcess.pid, signal);
      }
    }
    if (typeof commandOrProcessId === 'number') {
      const processId = commandOrProcessId as number;
      treeKill(processId, signal);
    }
  }

  /**
   * Connects to an existing process or creates it, then returns it
   * @param command The command object
   * @param execute whether to automatically execute the command
   */
  public connect(command: Command, execute?: boolean): NodePty.IPty {
    const childProcess = this._ensureChildProcess(command);
    if (execute) {
      this.execute(command);
    }
    return childProcess;
  }

  public execute(command: Command, options = this.createPtyOptions(command)): NodePty.IPty {
    const childProcess = this._ensureChildProcess(command, options);
    childProcess.write(createCommandString(command));
    childProcess.write('\n');
    return childProcess;
  }

  public createPtyOptions(command: Command): PtyOptions {
    return {
      ...defaults,
      cwd: command.cwd,
      env: {
        ...(process.env as { [key: string]: string }),
        ...toObject(command.env)
      }
    } as PtyOptions;
  }

  private _ensureChildProcess(command: Command, options = this.createPtyOptions(command)): NodePty.IPty {
    const record = this.childProcessMap[command.id];
    if (!record) {
      return this._createChildProcess(command.id, options).childProcess;
    }
    return record.childProcess;
  }

  private _createChildProcess(commandId: string, options: PtyOptions): PtyChildRecord {
    const ptyOptions = { ...defaults, ...options };
    const pty = NodePty.spawn(ptyOptions.shell, [], {
      cols: ptyOptions.cols,
      rows: ptyOptions.rows,
      env: ptyOptions.env,
      cwd: ptyOptions.cwd
    });

    const record: PtyChildRecord = {
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

export const defaultPtyManager = new PtyManager();
