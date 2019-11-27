import React from 'react';
import { Field } from 'formik';
import cx from 'classnames';
export const CheckInput: React.FC<React.HTMLProps<HTMLInputElement> & {
  type: 'radio' | 'checkbox';
  label: string;
  className?: string;
}> = props => {
  const { current: id } = React.useRef<string>(props.id || `${Math.random()}`);
  return (
    <>
      <Field {...props} id={id} className={cx('is-checkradio', props.className)} />
      <label htmlFor={id} className={props.type}>
        {props.label}
      </label>
    </>
  );
};
