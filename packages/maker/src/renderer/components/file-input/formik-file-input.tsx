import React from 'react';

import { FileInput, FileInputProps } from './file-input';
import { Field, FieldAttributes } from 'formik';
import { pluck } from 'renderer/utils/pluck';

type FormikChildProps = { field: FieldAttributes<React.InputHTMLAttributes<HTMLInputElement>> };

export const FormikFileInput: React.FC<FileInputProps> = props => {
  const [fileInputProps, formikProps] = pluck(props, [
    'className',
    'title',
    'data-validate',
    'buttonLabel',
    'icon',
    'openFile',
    'openDirectory',
    'multiSelections'
  ]);

  return (
    <Field {...formikProps}>
      {(formikProps: FormikChildProps) => <FileInput {...fileInputProps} {...formikProps.field} />}
    </Field>
  );
};
