import React from 'react';
import cx from 'classnames';

export const Icon: React.FC<{
  icon: string;
  small?: boolean;
  family?: 'fa' | 'fas';
  className?: string;
}> = ({ family = 'fas', icon, className, small, ...props }) => (
  <span className={cx(className, 'icon', { 'is-small': small })} key={icon} {...props}>
    <i className={cx(family, icon)} aria-hidden="true"></i>
  </span>
);
