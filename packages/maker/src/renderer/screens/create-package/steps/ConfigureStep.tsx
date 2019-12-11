import React from 'react';
import { Formik, Form } from 'formik';
import cx from 'classnames';

import { FormValues, ValidationSchema } from '../form-schema';

import { ButtonGroup } from 'renderer/components/button-group/button-group';
import { getValues, defaultInitialValues, resetValues } from '../form-values';
import { CheckInput } from 'renderer/components/check-input/CheckInput';
import { FormField, FormFieldProps } from 'renderer/components/form-field/FormField';
import { Input } from 'renderer/components/form-input/FormInput';
// import { findOption } from '@kimono/generator-package/lib/generators/app/options';
import { PackageNameInput } from 'renderer/components/package-name-input/package-name-input';
import { FormikFileInput } from 'renderer/components/file-input/formik-file-input';
import { Columns } from 'renderer/components/columns/Columns';

const InputField: React.FC<FormFieldProps & { name: string; placeholder?: string }> = React.memo(
  ({ name, placeholder, ...props }) => (
    <FormField {...props}>
      <Input name={name} placeholder={placeholder} clearable />
    </FormField>
  )
);

export const ConfigureStep: React.FC<{
  onSubmit: (values: FormValues) => void;
}> = props => {
  return (
    <Formik initialValues={getValues()} onSubmit={props.onSubmit} validationSchema={ValidationSchema}>
      {({ errors, touched, resetForm, setValues, values }) => {
        const getError = (name: keyof FormValues) => (touched[name] ? errors[name] : undefined);
        return (
          <Form>
            <section>
              <h5>General</h5>

              <FormField horizontal label={'Destination folder'} error={getError('dest')}>
                <FormikFileInput
                  placeholder="(Optional) Location of the folder in which to create the package"
                  name="dest"
                  openDirectory
                  openFile={false}
                />
              </FormField>

              <FormField horizontal label={'Template folder'} error={getError('tpl')}>
                <FormikFileInput
                  placeholder="(Optional) Location of the template folder to use"
                  name="tpl"
                  openDirectory
                  openFile={false}
                />
              </FormField>

              <PackageNameInput
                horizontal
                className="is-flex-1"
                scope={values.packageScope}
                scopeError={getError('packageScope')}
                nameError={getError('packageName')}
              />

              <FormField horizontal label="Transpiler">
                <CheckInput type="radio" name={'transpiler'} value="typescript" label={'Typescript'} />
                <CheckInput type="radio" name={'transpiler'} value="babel" label={'Babel'} />
              </FormField>

              <FormField horizontal label="General">
                <CheckInput type="checkbox" name={'private'} label={'Private'} />
                <CheckInput type="checkbox" name={'yarn'} label={'Use yarn'} />
                <CheckInput type="checkbox" name={'install'} label={'Install'} />
                <CheckInput type="checkbox" name={'verbose'} label={'Show all options'} />
              </FormField>
            </section>

            {values.verbose && (
              <section>
                <hr />
                <Columns>
                  <InputField label="License" name="license" horizontal />
                  <InputField label="Homepage" name="homepage" horizontal />
                </Columns>
                <Columns>
                  <InputField label="repository.type" name="repositoryType" horizontal />
                  <InputField label="repository.url" name="repositoryUrl" horizontal />
                </Columns>
                <Columns>
                  <InputField label="publishConfig.registry" name="publishRegistry" horizontal />
                  <FormField label="publishConfig.access" horizontal>
                    <Input as="select" name="publishAccess">
                      <option value="" label="" />
                      <option value="restricted" label="restricted" />
                      <option value="public" label="public" />
                    </Input>
                  </FormField>
                </Columns>
                <hr />
                <FormField label="dependencies" horizontal>
                  <Input
                    name={'dependencies'}
                    as="textarea"
                    className={cx({ 'mh-2': values.dependencies?.length })}
                    placeholder={'Comma-, space- or newline-separated'}
                  />
                </FormField>
                <FormField label="devDependencies" horizontal>
                  <Input
                    name={'devDependencies'}
                    as="textarea"
                    className={cx({ 'mh-2': values.devDependencies?.length })}
                    placeholder={'Comma-, space- or newline-separated'}
                  />
                </FormField>
                <FormField label="peerDependencies" horizontal>
                  <Input
                    name={'peerDependencies'}
                    as="textarea"
                    className={cx({ 'mh-2': values.peerDependencies?.length })}
                    placeholder={'Comma-, space- or newline-separated'}
                  />
                </FormField>
              </section>
            )}
            {/* Object.entries(getValues()).map(([key, value]) => {
              if (manualFields.includes(key)) return null;
              const option = findOption(key);
              if (option && option.verbose && !values.verbose) {
                return null;
              }
              if (Array.isArray(value)) {
                return <div key={key}>array {key}</div>;
              }
              if (typeof value === 'string') {
                return (
                  <FormField horizontal key={key} label={key} error={getError(key as keyof FormValues)}>
                    <Input name={key} placeholder={key} />
                  </FormField>
                );
              }
              if (typeof value === 'boolean') {
                return (
                  <FormField horizontal key={key} label={key} error={getError(key as keyof FormValues)}>
                    <CheckInput type="checkbox" name={key} />
                  </FormField>
                );
              }
              return null;
            }) */}
            <ButtonGroup className="mt-3 mb-2">
              <button
                className={cx('button is-primary')}
                type="button"
                onClick={() => {
                  resetForm();
                  resetValues();
                  setValues(defaultInitialValues);
                }}
              >
                Reset
              </button>
              <span className="is-flex-1" />
              <button className={cx('button is-primary')} type="submit">
                Next
              </button>
            </ButtonGroup>
          </Form>
        );
      }}
    </Formik>
  );
};
