import React from 'react';
import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import cx from 'classnames';

const NavLinkButton: React.FC<NavLinkProps & { primary?: boolean; success?: boolean }> = ({
  primary,
  success,
  className,
  ...props
}) => <NavLink className={cx('button', className, { 'is-primary': primary, 'is-success': success })} {...props} />;

export const NavLink: React.FC<NavLinkProps> & { Button: typeof NavLinkButton } = props => (
  <RouterNavLink activeClassName="is-active" exact {...props} />
);

NavLink.Button = NavLinkButton;
