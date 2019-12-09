import React from 'react';
import { Formik, Form } from 'formik';
import cx from 'classnames';

import { FormValues, ValidationSchema } from '../form-schema';

import { ButtonGroup } from 'renderer/components/button-group/button-group';
import { getValues, defaultInitialValues, resetValues } from '../form-values';
import { PackageNameInput } from 'renderer/components/package-name-input/package-name-input';
import { FormikFileInput } from 'renderer/components/file-input/formik-file-input';
import { FormField } from 'renderer/components/form-field/FormField';
import { CheckInput } from 'renderer/components/check-input/CheckInput';

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
              <FormField label={'Project location'} error={getError('cwd')}>
                <FormikFileInput
                  placeholder="Folder in which to create the project"
                  name="cwd"
                  openDirectory
                  openFile={false}
                />
              </FormField>

              <PackageNameInput
                className="is-flex-1"
                scope={values.packageScope}
                scopeError={getError('packageScope')}
                nameError={getError('packageName')}
              />
            </section>

            <section>
              <h5>Framework</h5>
              <FormField>
                <CheckInput type="radio" name="framework" label="None" value="" />
                <CheckInput type="radio" name="framework" label="React" value="react" />
                <CheckInput type="radio" name="framework" label="Vue" value="vue" />
              </FormField>
            </section>

            <section>
              <h5>Pre-processors</h5>
              <FormField>
                <CheckInput label="ESLint" type="checkbox" name="eslint" />
                <CheckInput label="Prettier" type="checkbox" name="prettier" />
                <CheckInput label="TypeScript" type="checkbox" name="typescript" />
                <CheckInput label="LESS" type="checkbox" name="less" />
                <CheckInput label="SASS" type="checkbox" name="sass" />
              </FormField>
            </section>

            <section>
              <h5>Misc</h5>
              <FormField>
                <CheckInput type="checkbox" name="ejs" label="EJS Templates" />
                <CheckInput type="checkbox" name="nunjucks" label="Nunjucks templates" />
                <CheckInput type="checkbox" name="notifications" label="Webpack build notifications" />
              </FormField>
              <FormField>
                <CheckInput type="checkbox" name="install" label="Install dependencies" />
                <CheckInput type="checkbox" name="yarn" label="Use yarn" />
                <CheckInput type="checkbox" name="git" label="Initialize GIT" />
              </FormField>
            </section>

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
