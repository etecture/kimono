import { GeneratorOption } from '@kimono/yo-utils/lib/types';

export const options: GeneratorOption[] = [
  {
    name: 'yes',
    alias: 'y',
    default: false,
    type: Boolean,
    description: 'yes: Skip questions and use default values?'
  },
  {
    name: 'tpl',
    type: String,
    description: 'tpl: (Optional) Location of custom template'
  },
  {
    name: 'dest',
    alias: 'd',
    type: String,
    description: 'out: (Optional) Destination path in which to create the package'
  },
  {
    name: 'verbose',
    alias: 'v',
    default: false,
    type: Boolean,
    description: 'verbose: Answer all available questions instead of only the common ones?'
  },
  {
    name: 'install',
    alias: 'i',
    default: true,
    type: Boolean,
    description: 'install: Install dependencies after setup?'
  },
  {
    name: 'yarn',
    default: true,
    type: Boolean,
    description: 'yarn: Use yarn instead of npm?'
  },
  {
    name: 'scope',
    type: String,
    description: 'scope: If provided, it will override the scope given via projectName'
  },
  {
    name: 'symlink',
    type: String,
    description: 'symlink: Path to a folder into which to create a symlink to the new package'
  },
  //------------------
  {
    name: 'private',
    type: Boolean,
    description: 'Whether the package should be private and never published to the registry'
  },
  {
    verbose: true,
    name: 'license',
    default: 'MIT',
    type: String,
    description: 'The "license" value. Change to UNLICENSED for closed-source projects'
  },
  {
    verbose: true,
    name: 'homepage',
    default: '',
    type: String,
    description: 'The url to the project homepage.'
  },
  {
    verbose: true,
    name: 'repositoryUrl',
    type: String,
    description: 'repositoryUrl: Optional value for "repository.url"'
  },
  {
    verbose: true,
    name: 'repositoryType',
    default: 'git',
    type: String,
    description: 'repositoryType: Optional value for "repository.type". Defaults to "git"'
  },
  {
    verbose: true,
    name: 'publishRegistry',
    type: String,
    description: 'publishRegistry: Optional value for "publishConfig.registry"'
  },
  {
    verbose: true,
    name: 'publishAccess',
    type: String,
    description: 'publishAccess: Optional value for "publishConfig.access". Defaults to "restricted", can be "public"'
  },
  {
    verbose: true,
    name: 'dependencies',
    type: String,
    description:
      'dependencies: Optional space-separated value of package names, optionally with version annotation via @, e.g. "lodash react@16.8.6"'
  },
  {
    verbose: true,
    name: 'devDependencies',
    type: String,
    description:
      'devDependencies: Optional space-separated value of package names, optionally with version annotation via @, e.g. "lodash react@16.8.6"'
  },
  {
    verbose: true,
    name: 'peerDependencies',
    type: String,
    description:
      'peerDependencies: Optional space-separated value of package names, optionally with version annotation via @, e.g. "lodash react@16.8.6"'
  },
  {
    name: 'typescript',
    default: false,
    type: Boolean,
    description: 'typescript: Add support for compiling TypeScript script files?'
  }
];

export const findOption = (name: string) => options.find(o => o.name === name);
