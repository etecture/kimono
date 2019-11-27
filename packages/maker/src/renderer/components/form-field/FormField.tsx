import React, { ReactElement } from 'react';
import cx from 'classnames';

export const FormField: React.FC<{
  label?: string;
  className?: string;
  error?: string;
  addonBefore?: string;
  addonAfter?: string;
}> = props => {
  return (
    <div className={cx('field', props.className)}>
      <label className="label">{props.label}</label>
      <div className={cx('field', { 'has-addons': props.addonBefore || props.addonAfter })}>
        {props.addonBefore && (
          <div className="control">
            <div className="button is-static">{props.addonBefore}</div>
          </div>
        )}
        <div className="control is-flex is-expanded">
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
        {props.error ? <div className="help is-danger">{props.error}</div> : null}
      </div>
    </div>
  );
};
/* 

<div className="field is-horizontal">
  <div class="field-label"></div>
  <div class="field-body">
    <div class="field is-expanded">
      <div class="field has-addons">
        <p class="control">
          <a class="button is-static">
            +44
          </a>
        </p>
        <p class="control is-expanded">
          <input class="input" type="tel" placeholder="Your phone number">
        </p>
      </div>
      <p class="help">Do not enter the first zero</p>
    </div>
  </div>
</div>
 */
