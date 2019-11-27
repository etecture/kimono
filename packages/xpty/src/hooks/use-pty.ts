import React from 'react';
import path from 'path';
import * as NodePty from 'node-pty';

import treeKill from 'tree-kill';
import { platform } from 'os';
import { PtyOptions, defaults } from '../utils/pty-process-manager';

interface UsePtyOptions {
  /**
   * Whether to create the pty child process right away (even before `execute()` is called)
   */
  eager?: boolean;

  /**
   * Whether a created pty child process should be kept alive when the component unmounts.
   */
  resilient?: boolean;

  /**
   * Options for the pty. Only used if `eager` was set to true
   */
  ptyOptions?: Partial<PtyOptions>;
}

interface UsePtyController {
  /**
   * The `node-pty` child process pty
   */
  pty: NodePty.IPty | null;

  /**
   * Executes a command string.
   *
   * Creates child process if none was created yet, or if an options object was provided.
   * If an options object was provided, the current child process is killed and a new one is created.
   * @param command - The command to execute
   * @param options - Options for a pty child process to create.
   */
  execute: (command: string, options?: Partial<PtyOptions>) => void;

  /**
   * Kills the current pty child process, if there is one.
   */
  kill: (signal?: string) => void;

  /**
   * Writes SIGINT (Ctrl+C) to the child process, if there is one.
   */
  abort: () => void;

  /**
   * Changes the working directory of the child process, if there is one.
   */
  chdir: (cwd: string) => void;
}

/**
 * Creates a pty controller and returns it.
 */
export function usePty(hookOptions: UsePtyOptions = {}): UsePtyController {
  const [pty, setPty] = React.useState<NodePty.IPty | null>(null);

  /**
   * Creates the child process
   */
  const { current: createPty } = React.useRef(function createPty(options?: Partial<PtyOptions>) {
    const ptyOptions: PtyOptions = { ...defaults, ...options } as PtyOptions;
    return NodePty.spawn(ptyOptions.shell, [], {
      cols: ptyOptions.cols,
      rows: ptyOptions.rows,
      env: { ...(process.env as any), ...(ptyOptions.env as any) },
      cwd: ptyOptions.cwd && path.resolve(ptyOptions.cwd as string)
    });
  });

  const kill = React.useCallback(
    function kill(signal = platform() === 'win32' ? undefined : 'SIGKILL') {
      if (pty) {
        treeKill(pty.pid, signal);
        setPty(null);
      }
    },
    [pty]
  );

  const execute = React.useCallback(
    function execute(command: string, options?: Partial<PtyOptions>) {
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
    },
    [pty]
  );

  const abort = React.useCallback(
    function abort() {
      if (pty) {
        pty.write('\x03');
        pty.write('\n');
      }
    },
    [pty]
  );

  const chdir = React.useCallback(
    function chdir(cwd: string) {
      if (pty) {
        pty.write(`cd ${path.resolve(cwd)}`);
        pty.write('\n');
      }
    },
    [pty]
  );

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
