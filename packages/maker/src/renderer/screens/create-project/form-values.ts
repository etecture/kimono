import { FormValues } from './form-schema';
import { store } from './store';

// these values are used the very first time.
export const defaultInitialValues: FormValues = {
  cwd: '',
  packageName: '',
  packageScope: '',
  framework: '',
  typescript: false,

  sass: false,
  less: false,
  eslint: false,
  prettier: false,

  ejs: false,
  nunjucks: false,
  notifications: false,

  install: false,
  yarn: false,
  git: false
};

export const resetValues = () => store.set('values', defaultInitialValues);
export const setValues = (values: FormValues) => store.set('values', values);
export const getValues = () => store.get('values', defaultInitialValues);

export const initialValues = getValues();
