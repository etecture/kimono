import React from 'react';
import { defaultPtyManager, PtyEvent, PtyManager } from '../utils/pty-process-manager';

/**
 * Returns the pid of the native process for a given `commandId`, if one is running.
 *
 * @param commandId
 * @param ptyManager
 */
export function usePID(commandId?: string, ptyManager = defaultPtyManager): number | undefined {
  const [processId, setProcessId] = React.useState<number | undefined>(undefined);
  React.useEffect(() => {
    // check and maybe set initial value
    const pty = commandId ? ptyManager.get(commandId) : undefined;
    setProcessId(pty ? pty.pid : undefined);

    // update on spawn
    const handleSpawn = (payload: PtyEvent) => {
      if (payload.commandId === commandId) {
        setProcessId(payload.processId);
      }
    };

    // update on exit
    const handleExit = (payload: PtyEvent) => {
      if (payload.commandId === commandId) {
        setProcessId(undefined);
      }
    };

    ptyManager.on(PtyManager.SPAWN, handleSpawn);
    ptyManager.on(PtyManager.EXIT, handleExit);

    return () => {
      ptyManager.off(PtyManager.SPAWN, handleSpawn);
      ptyManager.off(PtyManager.EXIT, handleExit);
    };
  }, [commandId]);

  return processId;
}
