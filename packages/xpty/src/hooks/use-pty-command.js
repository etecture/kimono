import React from 'react';
import { defaultPtyManager, PtyManager } from '../utils/pty-process-manager';
import { usePID } from './use-pid';
/**
 * Creates and returns a child process given a command object
 *
 * @param command
 * @param ptyManager
 */
export function usePtyCommand(command, ptyManager = defaultPtyManager) {
    const [statePty, setStatePty] = React.useState(null);
    const exitListener = React.useRef(null);
    const { current: setPty } = React.useRef((pty) => {
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
        }
        else {
            dispose();
            setStatePty(null);
        }
    });
    React.useEffect(() => {
        const handleSpawn = ({ commandId }) => {
            var _a;
            if (commandId === ((_a = command) === null || _a === void 0 ? void 0 : _a.id)) {
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
        }
        else {
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
        var _a;
        if ((_a = command) === null || _a === void 0 ? void 0 : _a.autoRun) {
            execute();
        }
    }, []);
    return { pty: statePty, execute, kill };
}
//# sourceMappingURL=use-pty-command.js.map