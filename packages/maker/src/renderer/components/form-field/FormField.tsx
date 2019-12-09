import React, { ReactElement } from 'react';
import cx from 'classnames';
import styled from 'styled-components';

export interface FormFieldProps {
  label?: string;
  className?: string;
  error?: string | string[];
  addonBefore?: string;
  addonAfter?: string;
  horizontal?: boolean;
}

const StyledFormField = styled.div`
  &.is-horizontal {
    @media screen and (min-width: 769px), print {
      .field-label {
        padding-top: 0.5rem;
      }
    }
  }
`;

export const FormField: React.FC<FormFieldProps> = React.memo(props => {
  return (
    <StyledFormField className={cx('field', props.className, { 'is-horizontal': props.horizontal })}>
      <label className={cx('label', { 'field-label': props.horizontal })}>{props.label}</label>
      <div className={cx({ 'field-body': props.horizontal })}>
        <div className={cx('field', { 'has-addons': props.addonBefore || props.addonAfter })}>
          {props.addonBefore && (
            <div className="control">
              <div className="button is-static">{props.addonBefore}</div>
            </div>
          )}
          <div className={'control is-flex'}>
            {React.Children.map(props.children, c => {
              const child = c as ReactElement;
              return React.cloneElement(child, {
                ...child.props,
                className: cx({ 'is-danger': props.error }, child.props.className)
              });
            })}
          </div>
          {props.addonAfter && (
            <div className="control">
              <div className="button is-static">{props.addonAfter}</div>
            </div>
          )}
          {props.error ? (
            <div className="help is-danger">
              {Array.isArray(props.error) ? props.error.map((err, idx) => <div key={idx}>{err}</div>) : props.error}
            </div>
          ) : null}
        </div>
      </div>
    </StyledFormField>
  );
});
