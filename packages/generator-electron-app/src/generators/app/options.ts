import { GeneratorOption } from '../../types';

export const options: GeneratorOption[] = [
  {
    name: 'yes',
    alias: 'y',
    default: false,
    type: Boolean,
    description: 'yes: Skip questions and use default values?'
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
    name: 'git',
    alias: 'g',
    default: false,
    type: Boolean,
    description: 'git: Initialize git repository after setup?'
  },
  {
    name: 'eslint',
    default: true,
    type: Boolean,
    verbose: true,
    description: 'eslint: Add support for script file linting using eslint?'
  },
  {
    name: 'prettier',
    default: true,
    type: Boolean,
    description: 'prettier: Add prettier integration?'
  },
  {
    name: 'webpack',
    default: false,
    type: Boolean,
    description: 'webpack: Use custom configuration override?'
  },
  {
    name: 'typescript',
    default: false,
    type: Boolean,
    description: 'typescript: Add support for compiling TypeScript script files?'
  },
  {
    name: 'notifications',
    default: false,
    type: Boolean,
    verbose: true,
    description: 'notifications: Provide OS-level notifications from webpack during development?'
  },
  {
    name: 'react',
    default: false,
    type: Boolean,
    description: 'react: Configure for React development?'
  },
  {
    name: 'vue',
    default: false,
    type: Boolean,
    description: 'vue: Configure for Vue development?'
  },
  {
    name: 'ejs',
    default: false,
    type: Boolean,
    verbose: true,
    description: 'ejs: Add support for compiling EJS template files?'
  },
  {
    name: 'nunjucks',
    default: false,
    type: Boolean,
    verbose: true,
    description: 'nunjucks: Add support for compiling Nunjucks template files?'
  },
  {
    name: 'less',
    default: false,
    type: Boolean,
    verbose: true,
    description: 'less: Add support for compiling Less style files?'
  },
  {
    name: 'sass',
    default: false,
    type: Boolean,
    description: 'sass: Add support for compiling Sass/SCSS style files?'
  },
  //------------------------------------------------------------
  //
  // internal variables not exposed to the user
  //
  //------------------------------------------------------------
  {
    internal: true,
    name: 'electronWebpackConfig',
    default: false,
    type: Boolean
  },
  {
    internal: true,
    name: 'defaultRendererTemplate',
    default: true,
    type: Boolean
  }
];
