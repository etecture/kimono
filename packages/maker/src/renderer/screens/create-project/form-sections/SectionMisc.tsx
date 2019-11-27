import React from 'react';
import { FormField } from 'renderer/components/form-field/FormField';
import { CheckInput } from 'renderer/components/check-input/CheckInput';
export const SectionMisc = () => (
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
);
