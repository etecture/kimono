import React from 'react';
import { FormField } from 'renderer/components/form-field/FormField';
import { CheckInput } from 'renderer/components/check-input/CheckInput';
export const SectionPreprocessors = () => (
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
);
