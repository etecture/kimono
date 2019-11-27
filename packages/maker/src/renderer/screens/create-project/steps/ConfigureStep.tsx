import React from 'react';
import { Formik, Form } from 'formik';
import cx from 'classnames';

import { SectionGeneral } from '../form-sections/SectionGeneral';
import { SectionFrameworks } from '../form-sections/SectionFrameworks';
import { SectionPreprocessors } from '../form-sections/SectionPreprocessors';
import { SectionMisc } from '../form-sections/SectionMisc';
import { FormValues, ValidationSchema } from '../form-schema';

import { ButtonGroup } from 'renderer/components/button-group/button-group';
import { getValues, defaultInitialValues, resetValues } from '../form-values';

export const ConfigureStep: React.FC<{
  onSubmit: (values: FormValues) => void;
}> = props => {
  return (
    <Formik initialValues={getValues()} onSubmit={props.onSubmit} validationSchema={ValidationSchema}>
      {({ errors, touched, resetForm, setValues }) => (
        <Form>
          <SectionGeneral errors={errors} touched={touched} />
          <SectionFrameworks />
          <SectionPreprocessors />
          <SectionMisc />
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
      )}
    </Formik>
  );
};
