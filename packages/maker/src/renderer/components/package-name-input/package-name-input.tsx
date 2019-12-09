import React from 'react';
import cx from 'classnames';
import { FormField, FormFieldProps } from '../form-field/FormField';
import { Input } from '../form-input/FormInput';

export const PackageNameInput: React.FC<{
  scopeError?: string;
  nameError?: string;
  scope?: string;
} & FormFieldProps> = ({ scopeError, nameError, scope, ...props }) => {
  const [showScope, setShowScope] = React.useState(false);
  const addonColorClass = scope ? 'has-text-info' : 'has-text-grey-lighter';
  return (
    <FormField {...props} label={'Package name'}>
      <div className="field has-addons is-flex-1">
        <div className="control">
          <button type="button" className={cx('button', addonColorClass)} onClick={() => setShowScope(!showScope)}>
            @
          </button>
        </div>
        {showScope && (
          <>
            <div className="control">
              <Input className={cx({ 'is-danger': scopeError })} name={'packageScope'} placeholder="optional scope" />
              {scopeError && <div className="help is-danger">{scopeError}</div>}
            </div>
            <div className="control">
              <span className={cx('button is-static', addonColorClass)}>/</span>
            </div>
          </>
        )}
        <div className="control is-expanded">
          <Input className={cx({ 'is-danger': nameError })} name={'packageName'} placeholder="package name" />
          {nameError && <div className="help is-danger">{nameError}</div>}
        </div>
      </div>
    </FormField>
  );
};
