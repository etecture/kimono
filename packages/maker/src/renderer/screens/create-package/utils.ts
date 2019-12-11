import path from 'path';
import { packageUtils, fsUtils } from '@kimono/yo-utils';
import { options } from '@kimono/generator-package/lib/generators/app/options';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { FormValues } from './form-schema';

const arrayFields = ['dependencies', 'devDependencies', 'peerDependencies'];
const toArrayString = (val: string) =>
  val
    .replace(/\n/g, ',')
    .replace(/, /g, ',')
    .replace(/ /g, ',');

export function createCLICommand(values: Partial<FormValues>, ignoredKeys?: string[]) {
  const { framework, transpiler, packageName = '', packageScope = '', ...flags } = values;
  if (framework) {
    Object.assign(flags, { [framework]: true });
  }
  if (transpiler) {
    Object.assign(flags, { [transpiler]: true });
  }
  if (values.tpl) {
    values.tpl = path.resolve(values.tpl);
  }

  const args = Object.entries(flags).reduce(
    (result: string[], [key, value]) => {
      if (ignoredKeys && ignoredKeys.includes(key)) {
        return result;
      }

      const option = options.find(o => o.name === key);
      const isBool = option?.type === Boolean;
      const hasDefault = !!option?.default;
      if (!value && !isBool) {
        return result;
      }
      if (!value && hasDefault) {
        return [`--skip-${key}`, ...result];
      }
      if (arrayFields.includes(key)) {
        if (!value || !value.length) {
          return result;
        }
        if (typeof value === 'string') {
          return [`--${key}=${toArrayString(value)}`, ...result];
        }
      }
      if (!value) {
        return result;
      }
      if (isBool) {
        return [`--${key}`, ...result];
      }
      return [`--${key} ${value}`, ...result];
    },
    ['--yes']
  );

  const projectName = packageUtils.joinName({ packageName, packageScope });

  if (process.env.NODE_ENV === 'development') {
    const workspaceRoot = findWorkspaceRoot();
    if (workspaceRoot) {
      let scriptPath = path.resolve(workspaceRoot, 'packages/create-package/lib/index.js');
      // scriptPath = path.relative(process.cwd(), scriptPath);
      scriptPath = fsUtils.forwardSlashes(scriptPath);
      return `node ${scriptPath} ${projectName} ${args.join(' ')}`;
    } else {
      console.warn('>> unable to find workspace root');
    }
  }

  const baseCommand = values.yarn ? 'yarn create' : 'npm init';
  return `${baseCommand} @kimono/package ${projectName} ${args.join(' ')}`;
}
