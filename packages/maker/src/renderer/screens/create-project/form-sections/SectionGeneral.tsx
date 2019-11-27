import React from 'react';
import { FormField } from 'renderer/components/form-field/FormField';
import { Input } from 'renderer/components/form-input/FormInput';
import { CaretIcon } from 'renderer/components/caret-icon/CaretIcon';

import { FormikFileInput } from 'renderer/components/file-input/formik-file-input';
import { FormikErrors, FormikTouched } from 'formik';
import { FormValues } from '../form-schema';

// const licenseTypes = ["GNU AGPLv3","GNU GPLv3","GNU LGPLv3","Mozilla Public License 2.0","Apache License 2.0","MIT License","The Unlicense"]
// const licenses = ["GNU AGPLv3\n\nPermissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.","GNU GPLv3\n\nPermissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.","GNU LGPLv3\n\nPermissions of this copyleft license are conditioned on making available complete source code of licensed works and modifications under the same license or the GNU GPLv3. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work through interfaces provided by the licensed work may be distributed under different terms and without source code for the larger work.","Mozilla Public License 2.0\n\nPermissions of this weak copyleft license are conditioned on making available source code of licensed files and modifications of those files under the same license (or in certain cases, one of the GNU licenses). Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work may be distributed under different terms and without source code for files added in the larger work.","Apache License 2.0\n\nA permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights. Licensed works, modifications, and larger works may be distributed under different terms and without source code.","MIT License\n\nA short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.","The Unlicense\n\nA license with no conditions whatsoever which dedicates works to the public domain. Unlicensed works, modifications, and larger works may be distributed under different terms and without source code."]
export const SectionGeneral: React.FC<{
  errors: FormikErrors<FormValues>;
  touched: FormikTouched<FormValues>;
}> = ({ touched, errors }) => {
  const [showMore, setShowMore] = React.useState(false);
  const getError = (name: keyof FormValues) => (touched[name] ? errors[name] : undefined);
  return (
    <section>
      <h5>General</h5>
      <FormField label={'Project location'} error={getError('cwd')}>
        <FormikFileInput
          name="cwd"
          placeholder="Folder in which to create the project"
          openDirectory
          openFile={false}
        />
      </FormField>
      <FormField label={'Package name'} error={getError('packageName')}>
        <Input name="packageName" placeholder="package name" />
      </FormField>
      <a className="is-flex is-vcentered" onClick={() => setShowMore(!showMore)}>
        <CaretIcon dir={showMore ? 'down' : 'right'} /> Options
      </a>
      {showMore && (
        <>
          <FormField addonBefore="@" label={'Scope'} className="mt-1">
            <Input name="packageScope" placeholder="package name scope (namespace)" />
          </FormField>

          <FormField label={'Description'}>
            <Input
              as="textarea"
              name="projectDescription"
              placeholder="package description"
              style={{ height: 'auto' }}
            />
          </FormField>
        </>
      )}
    </section>
  );
};
