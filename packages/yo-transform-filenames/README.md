# @kimono/yo-filename-templates

A transform stream that supports a modified version of the EJS template syntax in names of template files and folders.

## Modified EJS syntax

Due to [reserved characters and words](https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words), some adjustments are necessary in order to use EJS template syntax in file and folder names.

There are several characters and constructs that you cannot use in their original form. You must use their supported alternatives instead.
While it's a bit of a weird-looking syntax, it gets the job done and was the most elegant solution I could find.

Check out [`src/replacements.ts`](./src/replacements.ts) for an overview of constructs that are handled specially.

### Angle brackets

In EJS syntax, you use angle brackets for defining all sorts of [Tags](https://ejs.co/#docs).
Because angle brackets are reserved and cannot be used in filenames, you have to use curly brackets:

- `<%` becomes `{%`
- `%>` becomes `%}`
- `<%=foo%>` becomes `{%=foo%}`

### Boolean syntax: binary

Because the pipe `|` is reserved and cannot be used in filenames, you have to use an alternative.
For consistency reasons, the non-reserved `&` character requires you to use an alternative as well:

- `&&` becomes `#++`
- `||` becomes `#--`
- `a && b` becomes `a #++ b`
- `a && b || baz` becomes `a #++ b #-- baz`

### Boolean syntax: ternary

Because both `?` and `:` are reserved and cannot be used in filenames, you have to use alternatives:

- `?` becomes `#+`
- `:` becomes `#-`
- `a ? b : c` becomes `a #+ b #- c`

## Features

_Please note that in the following examples, we assume that variables were provided as context data (via CLI argument, CLI option or as an answer to some inquirer question)_

### Camel-cased and Pascal-cased values

Many times you will want to use the same value for a filename and for code inside of that file. But that value may contain characters that are invalid in code identifiers, for example spaces or dashes.

For this reason, all context variables are provided to the templates in a camel-cased variant that has `CC` appended to its name, as well as in a pascal-cased variant that has `PC` appended to its name.

For example, given context data `{projectName: 'my-project'}`, your templates will have access to `{projectName: 'my-project', projectNameCC: 'myProject', projectNamePC: 'MyProject'}`.

### Variable interpolation

Inject values into file and folder names.

- Desired EJS template syntax: `<%= filename %>.js`
- Supported template filename: `{%= filename %}.js`
- Given the context `{filename: 'foo'}`, the file is copied as `foo.js`

### Conditionally name files

- Desired EJS template syntax: `index<%= typescript ? ".ts" : ".js" %>`
- Supported template filename: `index{%= typescript #+ ".ts" #- ".js" %}`
- Given the context `{typescript: true}`, the file is copied as `index.ts`
- Given the context `{typescript: false}`, the file is copied as `index.js`

### Conditionally copy or omit files

Template files with a boolean expression in their name will only be copied if that expression resolves truthy.

- Desired EJS template syntax: `<%= foo && "foo.json" %>`
- Supported template filename: `{%= foo #++ "foo.json" %}`
- Given the context `{foo: true}`, the file will be copied to the target as `foo.json`
- Given the context `{foo: false}`, the file will **not** be copied to the target at all

## Recipes

### Conditinal `tsconfig.json`

Only copy the `tsconfig.json` file when `typescript` was selected:

- `templates/src/{%= typescript #++ tsconfig.json %}`

### Dynamic file extension

Useful to decide for the proper file extension based on given user options.

- e.g. `templates/src/index.{%= typescript #+ "ts" #- "js" %}`
- e.g. `templates/src/styles.{%= sass #++ "scss" #-- less #++ "less" #-- "css" %}`

### javascript entry file and main file

For a package generator, you could provide an index file that has a static name, and a main file that has a dynamic name - the name of the package itself.

The function definition in the main file uses the camel-cased variable to avoid syntax errors, e.g. `fetch-users` becomes `fetchUsers`:

##### Template file `templates/src/index.js`:

```js
export { default } from './<%=packageName%>';
```

##### Template file `templates/src/{%=packageName%}.js`

```jsx
export default function <%=packageNameCC%>() {
    return [];
}
```

### Typescript/Javascript component template

You could provide a template that supports a `typescript` option.
You would then copy the template files as `.js` or `.ts`/`.tsx` accordingly, and with either propTypes or an interface defined in the component.

##### Template file `templates/src/index.{%= typescript #+ "ts" #- "js" %}`:

```js
export { default } from './<%=packageName%>';
```

##### Template file `templates/src/{%=packageName%}.{%= typescript #+ "tsx" #- "js" %}`

```jsx
import React from 'react';
<%if (!typescript) { %>import PropTypes from 'prop-types';<% } %>
import cx from 'classnames';

<%if (typescript) { %>
export interface <%=packageNamePC%>Props {
    children?: React.ReactChild;
    className?: string;
}
<% } else { %>
<%=packageNamePC%>.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
<% } %>
<% if (!typescript) { %>export default function <%=packageNamePC%>({ children, className, ...props }) {<% } %>
<% if (typescript) { %>export default function <%=packageNamePC%>({ children, className, ...props }: <%=packageNamePC%>Props): React.ReactElement {<% } %>
    return (
        <div className={cx('<%=packageNamePC%>', className)} {...props}>
            {children}
        </div>
    );
};

```

#### Javascript output

Given the context `{packageName: 'my-react-component', typescript: false}`, the resulting files will be:

##### Output file `src/index.ts`:

```js
export { default } from './my-react-component';
```

##### Output file `src/my-react-component.js`

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

MyReactComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
export default function MyReactComponent({ children, className, ...props }) {
  return (
    <div className={cx('MyReactComponent', className)} {...props}>
      {children}
    </div>
  );
}
```

#### Typescript output

Given the context `{packageName: 'my-react-component', typescript: true}`, the resulting files will be:

##### Output file `src/index.ts`:

```js
export { default } from './my-react-component';
```

##### Output file `src/my-react-component.tsx`

```tsx
import React from 'react';
import cx from 'classnames';

export interface MyReactComponentProps {
  children: React.ReactChild;
  className?: string;
}
export default function MyReactComponent({ children, className, ...props }: MyReactComponentProps): React.ReactElement {
  return (
    <div className={cx('MyReactComponent', className)} {...props}>
      {children}
    </div>
  );
}
```
