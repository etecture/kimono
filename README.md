# @kimono/workspace

Monorepo for the `@kimono` packages.

The goal of this project is to provide general tools and helpers for working with monorepos.
Currently, the focus is on electron apps, but will become broader in near feature.

## Installation

This project uses yarn workspaces. Development is incompatible with npm and you will have to use `yarn`.

Install the dependencies in the project root folder, then run `yarn setup`

```
git clone git@github.com:etecture/kimono.git
cd kimono
yarn
```

The `yarn setup` command will compile the native modules and transpile all workspace packages. After that, you can start development via `yarn start`.

## Usage

### `yarn start`

Start the `watch` and `maker` scripts in parallel.

### `yarn build`

Compile all non-app packages from typescript to javascript.

### `yarn dist`

Compile all app packages and create the distributable (installer). (Currently only `@kimono/maker`)

### `yarn native`

Compile native modules for the local electron version.

### `yarn rebuild`

Like `yarn build`, but wipe the output folders and delete incremental compilation information first.

### `yarn watch`

Like `yarn build`, but watch the sources and recompile after changes.

### `yarn clean`

Removes all build artifacts, e.g. `lib` folders and `.tsbuildinfo` files.

### `yarn lint`

Runs eslint on all packages.

### `yarn maker`

Launches the development server for the `@kimono/maker` app.
