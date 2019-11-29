# @kimono/workspace

Monorepo for the `@kimono` packages.

The goal of this project is to provide general tools and helpers for working with monorepos.
Currently, the focus is on electron apps, but will become broader in near feature.

## Installation

This project uses yarn workspaces. Development is incompatible with npm and you will have to use `yarn`.

Install the dependencies in the project root folder, rebuild the native modules for electron, do a one-time build of workspace packages:

```
git clone git@github.com:etecture/kimono.git
cd kimono
yarn install
yarn rebuild-native
yarn build
```

Now you can start using the following package scripts.

## Usage

### `yarn maker`

Launches the development server for the `@kimono/maker` app.

### `yarn build`

Compiles all packages from typescript to javascript.

### `yarn rebuild`

Like `yarn build`, but wipes the output folders and deletes incremental compilation information first.

### `yarn watch`

Like `yarn build`, but watches the sources and recompiles after changes.

### `yarn clean`

Removes all build artifacts, e.g. `lib` folders and `.tsbuildinfo` files.

### `yarn lint`

Runs eslint on all packages.

### `yarn rebuild-native`

Compiles native modules for the local electron version.
