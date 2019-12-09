import React from 'react';
import { Field } from 'formik';
import cx from 'classnames';
export const CheckInput: React.FC<React.HTMLProps<HTMLInputElement> & {
  type: 'radio' | 'checkbox';
  label?: string;
  className?: string;
}> = React.memo(props => {
  const [id, setId] = React.useState(props.id);
  React.useEffect(() => {
    if (!props.id) {
      setId(`CheckInput_${Math.floor(Math.random() * 10000)}`);
    }
  }, []);

  return (
    <>
      <Field {...props} id={id} className={cx('is-checkradio', props.className)} />

      <label htmlFor={id} className={props.type}>
        {props.label}
      </label>
    </>
  );
});
