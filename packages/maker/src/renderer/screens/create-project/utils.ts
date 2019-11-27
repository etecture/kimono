import path from 'path';
import { joinName } from '@kimono/generator-electron-app/lib/utils/packageUtils';
import { options } from '@kimono/generator-electron-app/lib/generators/app/options';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { FormValues } from './form-schema';

export function createCLICommand(values: Partial<FormValues>, ignoredKeys?: string[]) {
  const { framework, packageName = '', packageScope = '', ...flags } = values;
  if (framework) {
    Object.assign(flags, { [framework]: true });
  }
  const args = Object.entries(flags).reduce(
    (result: string[], [key, value]) => {
      if (ignoredKeys && ignoredKeys.includes(key)) {
        return result;
      }
      if (!value && options.find(o => o.name === key && o.default)) {
        return [`--skip-${key}`, ...result];
      }
      if (!value) {
        return result;
      }
      return [`--${key}`, ...result];
    },
    ['--yes']
  );

  const projectName = joinName({ packageName, packageScope });

  if (process.env.NODE_ENV === 'development') {
    const workspaceRoot = findWorkspaceRoot();
    if (workspaceRoot) {
      const scriptPath = path.resolve(workspaceRoot, 'packages/create-electron-app/lib/index.js');
      return `node ${scriptPath.replace(/\\/g, '/')} ${projectName} ${args.join(' ')}`;
    } else {
      console.warn('>> unable to find workspace root');
    }
  }

  const baseCommand = values.yarn ? 'yarn create' : 'npm init';
  return `${baseCommand} @kimono/electron-app ${projectName} ${args.join(' ')}`;
}
