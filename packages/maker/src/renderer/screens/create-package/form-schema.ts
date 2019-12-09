import * as Yup from 'yup';
import { KeyValueItem } from '@kimono/xpty';

export interface FormValues {
  verbose: boolean;
  cwd: string;
  projectName: string;
  packageName?: string;
  packageScope?: string;
  transpiler?: string;
  framework?: string;
  install?: boolean;
  yarn?: boolean;
  typescript?: boolean;
  private?: boolean;
  license?: string;
  homepage?: string;
  repositoryUrl?: string;
  repositoryType?: string;
  publishRegistry?: string;
  publishAccess?: '' | 'public' | 'restricted';
  dependencies?: string;
  devDependencies?: string;
  peerDependencies?: string;

  env?: KeyValueItem[];
}

const alphanumeric = {
  regex: /^[a-zA-Z0-9-_]+$/,
  message: 'Must contain only alphanumeric characters, dashes or underscores'
};

export const ValidationSchema = Yup.object().shape({
  cwd: Yup.string().required('Required'),
  packageName: Yup.string()
    .required('Required')
    .matches(alphanumeric.regex, alphanumeric.message),
  packageScope: Yup.string().matches(alphanumeric.regex, alphanumeric.message)
});
