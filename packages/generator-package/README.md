# @kimono/generator-electron-app

Yeoman generator for [@kimono/create-electron-app](https://www.npmjs.com/package/@kimono/create-electron-app).

### Arguments

#### `packageName`

Name for the new project. A folder is created with that name, and the project is installed in it.
Required if you want to use the `--yes` option (silent mode).
Optional for interactive mode, where it will be the default value for the `packageName` question.

Example:

```
yarn create @kimono/electron-app my-project
```

### Options

#### `--help`

Prints a table of available options.

#### `--yes`

Short: `-y`

Silent mode. Answer all questions with yes and use recommended defaults.
Only available with `packageName` argument.

Example:

```
yarn create @kimono/electron-app my-project --yes
```

#### `--yarn` (default: `true`)

Whether to use `yarn` instead of `npm`.
Use `--no-yarn` to omit.

Example:

```
npm init @kimono/electron-app --no-yarn
```

#### `--install` (default: `true`)

Whether to install the dependencies after setup.
Use `--no-install` to omit.

```
npm init @kimono/electron-app --no-install
```

#### Add-ons

All add-ons that are supported by `electron-webpack` are or will be available as a question and CLI option.  
For the exact naming of each CLI option, check the `--help`.
For details about each of the add-ons, check the [electron-webpack documentation](https://webpack.electron.build/add-ons).

```
Usage:
  yo @kimono/electron-app:app [<packageName>] [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers                                                  Default: false
        --skip-install   # Do not automatically install dependencies                                       Default: false
        --force-install  # Fail on install dependencies error                                              Default: false
  -y,   --yes            # Skip questions and use default values?                                          Default: false
  -i,   --install        # Install dependencies after setup?                                               Default: true
        --yarn           # Use yarn instead of npm?                                                        Default: true
        --webpack        # webpack: Use custom configuration override?                                     Default: true
        --eslint         # eslint: Add support for script file linting using eslint?                       Default: true
        --typescript     # typescript: Add support for compiling TypeScript script files?                  Default: false
        --notifications  # notifications: Provide OS-level notifications from webpack during development?  Default: false
        --ejs            # ejs: Add support for compiling EJS template files?                              Default: false
        --nunjucks       # Add snunjucks: upport for compiling Nunjucks template files?                    Default: false
        --less           # less: Add support for compiling Less style files?                               Default: false
        --sass           # sass: Add support for compiling Sass/SCSS style files?                          Default: false
```
