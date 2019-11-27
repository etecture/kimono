import React from 'react';
import { Field } from 'formik';
import cx from 'classnames';
export const Input: React.FC<React.HTMLProps<HTMLInputElement> & {
  className?: string;
}> = props => <Field {...props} className={cx('input', props.className)} />;
