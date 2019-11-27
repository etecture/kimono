/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
module.exports.excludeWorkspaceLibs = excludeWorkspaceLibs;
function excludeWorkspaceLibs({ ...config }, rootDir) {
  const rootPackage = require(path.resolve(rootDir, 'package.json'));
  const workspaceFolderNames = getWorkspaceNames(rootPackage);

  const eslintLoader = config.module.rules.find(({ loader }) => loader === 'eslint-loader');

  if (!eslintLoader) {
    return config;
  }

  const slash = '(\\\\|\\/)';
  eslintLoader.exclude = [
    eslintLoader.exclude,
    ...workspaceFolderNames.map(workspaceName => {
      return new RegExp(`${workspaceName}${slash}.+${slash}lib${slash}`);
    })
  ];

  return config;
}

/**
 * Takes a parsed package.json object and returns an array with names of workspace folders
 * @type {(pkg: object) => string[]}
 */
module.exports.getWorkspaceNames = getWorkspaceNames;
function getWorkspaceNames(pkg) {
  const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces.packages;
  if (!Array.isArray(workspaces)) {
    console.warn('[getWorkspaceNames] No workspaces found');
    return [];
  }

  return workspaces.map(name => name.split('/*')[0]);
}
