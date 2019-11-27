import React from 'react';
import cx from 'classnames';
export const Screen: React.FC<{ className: string }> = props => {
  return (
    <div className={cx(props.className, 'ScreenWrapper')}>
      <section className="section is-flex-1">
        <div className="container">{props.children}</div>
      </section>
    </div>
  );
};
