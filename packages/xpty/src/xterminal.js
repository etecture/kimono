import React from 'react';
import cx from 'classnames';
import { XTerminalPtyAdapter } from './utils/pty-react-adapter';
export const defaultTerminalOptions = {
    fontFamily: 'Fira Code, Iosevka, monospace',
    fontSize: 12
};
export const XTerminal = props => {
    const element = React.useRef(null);
    React.useEffect(() => {
        if (!props.pty) {
            return () => null;
        }
        const adapter = new XTerminalPtyAdapter(Object.assign(Object.assign({}, defaultTerminalOptions), props.options));
        adapter.setElement(element.current);
        adapter.setPty(props.pty, props.readOnly);
        return () => adapter.destroy();
    }, [props.pty]);
    const { current: handleWheel } = React.useRef((event) => event.stopPropagation());
    return (React.createElement("div", { className: cx('XTermView', props.className), onWheel: handleWheel },
        !props.pty && React.createElement("div", { className: "notification is-dark is-family-code is-small" }, "Not started"),
        React.createElement("div", { ref: element })));
};
//# sourceMappingURL=xterminal.js.map