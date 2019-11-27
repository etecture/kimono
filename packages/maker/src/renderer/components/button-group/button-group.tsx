import React from 'react';
import cx from 'classnames';

export const ButtonGroup: React.FC<{ className?: string; right?: boolean }> = props => {
  return <div className={cx(props.className, 'buttons', { 'is-right': props.right })}>{props.children}</div>;
};
