/**
 * A wrapper around xterm.
 * Takes care of loading/handling addons (e.g resizing via FitAddon)
 */

import * as NodePty from 'node-pty';

import { Terminal, IDisposable, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export class XTerminalPtyAdapter {
  readonly terminal: Terminal;

  private fitAddon: FitAddon;
  private resizeObserver?: ResizeObserver;
  private currentWidth?: number;
  private currentHeight?: number;

  private delayedFitID?: number;

  private ptyDataListener?: IDisposable;
  private terminalDataListener?: IDisposable;
  private terminalResizeListener?: IDisposable;

  constructor(options?: ITerminalOptions) {
    this.terminal = new Terminal(options);
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
  }

  public setElement(element: HTMLElement) {
    this.terminal.open(element);

    this.fitAddon.fit();

    this.resizeObserver = new window.ResizeObserver(([entry]: ResizeObserverEntry[]) => {
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

  public setPty(pty: NodePty.IPty, readOnly?: boolean) {
    this.ptyDataListener = pty.onData(data => {
      this.terminal.write(data);
    });
    if (!readOnly) {
      this.terminalDataListener = this.terminal.onData(data => {
        pty.write(data);
      });
    }
    this.terminalResizeListener = this.terminal.onResize(size => {
      pty.resize(
        Math.max(size ? size.cols : this.terminal.cols, 1),
        Math.max(size ? size.rows : this.terminal.rows, 1)
      );
    });
    pty.resize(this.terminal.cols, this.terminal.rows);
  }

  public destroy() {
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
