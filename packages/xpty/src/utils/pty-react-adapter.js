/**
 * A wrapper around xterm.
 * Takes care of loading/handling addons (e.g resizing via FitAddon)
 */
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
export class XTerminalPtyAdapter {
    constructor(options) {
        this.terminal = new Terminal(options);
        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
    }
    setElement(element) {
        this.terminal.open(element);
        this.fitAddon.fit();
        this.resizeObserver = new window.ResizeObserver(([entry]) => {
            const width = Math.floor(entry.contentRect.width);
            const height = Math.floor(entry.contentRect.height);
            if (width !== this.currentWidth || height !== this.currentHeight) {
                this.currentWidth = width;
                this.currentHeight = height;
                this.delayedFitID = window.requestAnimationFrame(() => this.fitAddon.fit());
            }
        });
        this.resizeObserver.observe(element);
    }
    setPty(pty, readOnly) {
        this.ptyDataListener = pty.onData(data => {
            this.terminal.write(data);
        });
        if (!readOnly) {
            this.terminalDataListener = this.terminal.onData(data => {
                pty.write(data);
            });
        }
        this.terminalResizeListener = this.terminal.onResize(size => {
            pty.resize(Math.max(size ? size.cols : this.terminal.cols, 1), Math.max(size ? size.rows : this.terminal.rows, 1));
        });
        pty.resize(this.terminal.cols, this.terminal.rows);
    }
    destroy() {
        if (this.delayedFitID) {
            window.cancelAnimationFrame(this.delayedFitID);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.fitAddon) {
            this.fitAddon.dispose();
        }
        if (this.terminalDataListener) {
            this.terminalDataListener.dispose();
        }
        if (this.terminalResizeListener) {
            this.terminalResizeListener.dispose();
        }
        if (this.ptyDataListener) {
            this.ptyDataListener.dispose();
        }
        this.terminal.dispose();
    }
}
//# sourceMappingURL=pty-react-adapter.js.map