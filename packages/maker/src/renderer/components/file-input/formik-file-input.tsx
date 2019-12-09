import React from 'react';

import { FileInput, FileInputProps } from './file-input';
import { Field, FieldAttributes } from 'formik';
import { pluck } from 'renderer/utils/pluck';

type FormikChildProps = { field: FieldAttributes<React.InputHTMLAttributes<HTMLInputElement>> };

export const FormikFileInput: React.FC<FileInputProps> = props => {
  const [fileInputProps, formikUpstreamProps] = pluck(props, [
    'className',
    'title',
    'data-validate',
    'buttonLabel',
    'icon',
    'openFile',
    'openDirectory',
    'placeholder',
    'multiSelections'
  ]);

  return (
    <Field {...formikUpstreamProps}>
      {(formikDownstreamProps: FormikChildProps) => <FileInput {...fileInputProps} {...formikDownstreamProps.field} />}
    </Field>
  );
};
