import React from 'react';
import { FormField } from 'renderer/components/form-field/FormField';
import { CheckInput } from 'renderer/components/check-input/CheckInput';
export const SectionFrameworks = () => (
  <section>
    <h5>Framework</h5>
    <FormField>
      <CheckInput type="radio" name="framework" label="None" value="" />
      <CheckInput type="radio" name="framework" label="React" value="react" />
      <CheckInput type="radio" name="framework" label="Vue" value="vue" />
    </FormField>
  </section>
);
