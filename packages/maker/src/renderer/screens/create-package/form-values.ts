import { FormValues } from './form-schema';
import { store } from './store';

// these values are used the very first time.
export const defaultInitialValues: FormValues = {
  verbose: false,
  tpl: '',
  cwd: '',
  projectName: '',
  packageName: '',
  packageScope: '',
  transpiler: 'typescript',
  install: true,
  yarn: true,
  typescript: true,
  private: true,
  license: 'MIT',
  homepage: '',
  repositoryUrl: '',
  repositoryType: 'git',
  publishRegistry: '',
  publishAccess: '',
  dependencies: '',
  devDependencies: '',
  peerDependencies: ''
};

export const resetValues = () => store.set('values', defaultInitialValues);
export const setValues = (values: FormValues) => store.set('values', values);
export const getValues = () => store.get('values', defaultInitialValues);

export const initialValues = getValues();
