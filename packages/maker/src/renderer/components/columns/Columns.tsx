import React from 'react';
import cx from 'classnames';
export const Columns: React.FC<{ className?: string }> = ({ className, ...props }) => {
  return (
    <div className={cx('columns', className)}>
      {React.Children.map(props.children, (child, idx) => {
        return (
          <div className="column" key={idx}>
            {child}
          </div>
        );
      })}
    </div>
  );
};
