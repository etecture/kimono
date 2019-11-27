# @kimono/xpty

A react component and some helpers for building terminals in electron apps.  
Based on [`xterm`](https://www.npmjs.com/package/xterm) and [`node-pty`](https://www.npmjs.com/package/node-pty).

### Prerequisites

Make sure to include the xterm stylesheet in your app:

```js
import 'xterm/css/xterm.css';
```

Also, have a look at the [troubleshooting](#troubleshooting) section.

## Usage

There are two parts to using this:

1. A child process that is managed by node-pty and
2. A view that is managed by xterm

### Creating a pty

There are multiple ways to create a `pty`.

- There is a lower-level `ptyManager` class that you can use to connect to the same `pty` from multiple callsites
- There is a `usePtyCommand` hook that uses `ptyManager` under the hood. The `pty` is reusable if you provide a custom `id` option.
- There is a `usePty` hook for simpler cases. It creates a `pty` "inline" and returns it - you can not connect to it from multipe callsites.

### Rendering a terminal

There is an `XTerminal` component that expects an existing `pty` as a prop. You're free to choose how and where you create that, which depends on your use case.

### Example: `usePty`

This simpler variant allows you to simply `execute()` some CLI command.

```tsx
import React from 'react';
import { XTerminal, usePty } from '@kimono/xpty';

export const Example = () => {
  const { pty, execute } = usePty();
  return (
    <>
      <XTerminal pty={pty}>
      <button onClick={() => execute('ls -lah')}>Execute</button>
    </>
  )
}
```

### Example: `usePtyCommand`

```tsx
import React from 'react';
import { XTerminal, usePtyCommand } from '@kimono/xpty';

export const Example = () => {
  const { pty, execute } = usePtyCommand({
    cmd: 'ls -lah'
    cwd: '~'
  });
  return (
    <>
      <XTerminal pty={pty}>
      <button onClick={execute}>Execute</button>
    </>
  )
};
```

Here's an example with custom `id` and multiple components using the same `pty`

```tsx
export const ExampleCommandScreen = () => {
  const { pty, execute } = usePtyCommand({
    id: 'my-command',
    cmd: 'ls -lah'
  });
  return (
    <>
      <XTerminal pty={pty}>
      <button onClick={execute}>Execute</button>
    </>
  );
};
export const ExampleSidebarItem = () => {
  const { pty, execute } = usePtyCommand({
    id: 'my-command'
  });
  return (
    <>
      <button onClick={execute}>Execute</button>
    </>
  )
}
```

### TODO

- docs for existing features and props
- more features and props
- tests

### Troubleshooting

#### rebuild native module

After installation, the native [`node-pty`](https://www.npmjs.com/package/node-pty) module will be compiled for your local system. However, it needs to be compiled for the node version of used by electron, not necessarily the one on your local system.  
You can use the [`electron-builder`](https://www.npmjs.com/package/electron-builder) package and its `install-app-deps` command to do this:

```bash
npx electron-builder install-app-deps
```

Better yet: Add `electron-builder` locally and use a package script.

```bash
yarn add electron-builder --dev
```

```json
{
  "scripts": {
    "rebuild": "electron-builder install-app-deps"
  }
}
```

#### webpack

If you use this in an electron app with webpack, make sure to add `node-pty` to [webpack externals](https://webpack.js.org/configuration/externals/):

```js
// webpack.config.js
module.exports = {
  // ...
  externals: ['node-pty']
};
```
