# @kimono/create-electron-app

Initializer package for creating `electron-webpack` applications

## Usage

Use `yarn create` with this package to initialize a new project:

```
yarn create @kimono/electron-app
```

Alternatively, you can use `npm init @kimono/electron-app --no-yarn`. However, future versions will provide a `--workspaces` option that is incompatible with `npm`.

### Arguments and options

See [@kimono/generator-electron-app](https://www.npmjs.com/package/@kimono/generator-electron-app) for CLI arguments and options

## Roadmap

### ✅ 0.0.0 - setup

- monorepo/lerna
- workspaces
- typescript
- yeoman

### ✅ 0.1.0 - packages

- setup local development
- setup local testing of CLI
- setup "questions and CLI options" system
- use a single template `electron-webpack-quick-start`
- publish 0.1.0 on npm and test
  - publish `create-electron-app` package
  - publish `generator-electron-app` package
- Basic arguments and options
  - `projectName` argument
  - `--yes` option
  - `--yarn` option
  - `--install` option

### ✅ 0.2.0 - options

for `electron-webpack` add-ons

- `--build-notifications`
- `--ejs`
- `--eslint`
- `--less`
- `--nunjucks`
- `--sass`
- `--typescript`

for customization

- `--webpack`

### 0.3.0 - workspaces

Add questions and options for whether to use workspaces

- `--workspaces`
  - `--lerna`

### 0.4.0 - templates

Add custom templates with a resonable basic setup

- custom templates
- `--vue`
- `--react`
  - `--react-router`
  - `[--cra]` if workspaces were selected

### 0.5.0 - documentation

- compile proper documentation, probably markdown-based
- setup github pages

### ?.?.? - ?

### 1.0.0 - prerelease

- Tests?
- READMEs look good on npm
- everything works well

### 1.0.0 - release

- publish 1.0.0 on npm
- create git tag
- create medium article
- inform electron-webpack community
- post on echojs
- post on fullstacknews
- post on hackernews
