import React from 'react';
import { Icon } from '../icon/Icon';
export const CaretIcon: React.FC<{
  className?: string;
  dir: 'up' | 'down' | 'left' | 'right';
}> = ({ dir, ...props }) => <Icon icon={`fa-angle-${dir}`} {...props} />;
