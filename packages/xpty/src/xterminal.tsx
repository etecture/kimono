import React from 'react';

import * as NodePty from 'node-pty';

import cx from 'classnames';

import { XTerminalPtyAdapter } from './utils/pty-react-adapter';
import { ITerminalOptions } from 'xterm';

interface XTerminalProps {
  className?: string;
  pty?: NodePty.IPty | null;
  readOnly?: boolean;
  options?: ITerminalOptions;
}

export const defaultTerminalOptions = {
  fontFamily: 'Fira Code, Iosevka, monospace',
  fontSize: 12
};

export const XTerminal: React.FC<XTerminalProps> = props => {
  const element = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!props.pty) {
      return () => null;
    }
    const adapter = new XTerminalPtyAdapter({
      ...defaultTerminalOptions,
      ...props.options
    });
    adapter.setElement(element.current as HTMLElement);
    adapter.setPty(props.pty, props.readOnly);
    return () => adapter.destroy();
  }, [props.pty]);

  const { current: handleWheel } = React.useRef((event: React.WheelEvent<HTMLDivElement>) => event.stopPropagation());

  return (
    <div className={cx('XTermView', props.className)} onWheel={handleWheel}>
      {!props.pty && <div className="notification is-dark is-family-code is-small">Not started</div>}
      <div ref={element} />
    </div>
  );
};
