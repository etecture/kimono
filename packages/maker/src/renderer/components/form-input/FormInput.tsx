import React from 'react';
import { Field, FieldProps } from 'formik';
import cx from 'classnames';
import { Icon } from '../icon/Icon';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: 0;
  box-shadow: none;
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  height: auto;
`;

export const Input: React.FC<React.HTMLProps<HTMLInputElement> & {
  className?: string;
  clearable?: boolean;
}> = React.memo(({ clearable, ...props }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <Field {...props}>
      {({ field, form }: FieldProps) => (
        <>
          <input ref={inputRef} {...field} className={cx('input', props.className)} />
          {!!(clearable && field.value) && (
            <StyledButton
              className="button"
              type="button"
              onClick={() => {
                form.setFieldValue(field.name, '');
                inputRef.current?.focus();
              }}
            >
              <Icon icon="fa-times" />
            </StyledButton>
          )}
        </>
      )}
    </Field>
  );
});
