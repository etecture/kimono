import React from 'react';
import { Command } from '../command';
import { IDisposable, IPty } from 'node-pty';
import { defaultPtyManager, PtyManager } from '../utils/pty-process-manager';
import { usePID } from './use-pid';

export interface PtyController {
  pty: IPty | null;
  kill: (signal?: string) => void;
  execute: () => void;
}

/**
 * Creates and returns a child process given a command object
 *
 * @param command
 * @param ptyManager
 */
export function usePtyCommand(command?: Command | null, ptyManager = defaultPtyManager): PtyController {
  const [statePty, setStatePty] = React.useState<IPty | null>(null);
  const exitListener = React.useRef<IDisposable | null>(null);

  const { current: setPty } = React.useRef((pty: IPty | null) => {
    const dispose = () => {
      if (exitListener.current) {
        exitListener.current.dispose();
        exitListener.current = null;
      }
    };
    if (pty) {
      exitListener.current = pty.onExit(() => {
        dispose();
        setStatePty(null);
      });
      setStatePty(pty);
    } else {
      dispose();
      setStatePty(null);
    }
  });

  React.useEffect(() => {
    const handleSpawn = ({ commandId }: { commandId: string }) => {
      if (commandId === command?.id) {
        setPty(ptyManager.get(commandId));
      }
    };
    ptyManager.addListener(PtyManager.SPAWN, handleSpawn);
    return () => {
      ptyManager.removeListener(PtyManager.SPAWN, handleSpawn);
    };
  }, [command]);

  const pid = usePID(command ? command.id : undefined);
  React.useEffect(() => {
    const p = command && ptyManager.get(command.id);
    if (p) {
      setPty(p);
    } else {
      setPty(null);
    }
  }, [command, pid]);

  const execute = React.useCallback(() => {
    if (!command) {
      return;
    }
    const pty = ptyManager.connect(command, true);
    setPty(pty);
  }, [command]);

  const kill = React.useCallback(() => {
    if (command) {
      ptyManager.kill(command.id);
    }
  }, [command]);

  React.useEffect(() => {
    if (command?.autoRun) {
      execute();
    }
  }, []);

  return { pty: statePty, execute, kill };
}
