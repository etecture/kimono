import { OptionConfig } from 'yeoman-generator';
import { ParsedPath } from 'gulp-rename';

/**
 * A key/value pairs in form of an entry array
 */
export type VariableTuple = [string, string] | undefined;

/**
 * A function that takes a path and returns a path
 */
export type PathTransform = (path: ParsedPath, variable?: VariableTuple, regExp?: RegExp) => ParsedPath;

/**
 * A tuple of a given transform function and a context variable key/value for the transformation.
 */
export type PathVariableTransform = [PathTransform, VariableTuple];

export interface RunGeneratorOptions {
  argv?: string[];
}
export interface EWAGeneratorOptions {
  projectName?: string;
  yes?: boolean;
  verbose?: boolean;
  install?: boolean;
  yarn?: boolean;
  git?: boolean;
  // pre-processors
  typescript?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  less?: boolean;
  sass?: boolean;
  // frameworks
  react?: boolean;
  vue?: boolean;
  // templates
  ejs?: boolean;
  nunjucks?: boolean;
  // misc
  webpack?: boolean;
  notifications?: boolean;
  // computed values
  projectNameCC?: string;
  // internal values
  electronWebpackConfig?: boolean;
  defaultRendererTemplate?: boolean;
}

export interface GeneratorOption extends OptionConfig {
  /**
   * When `internal`, this option will never face the user. It is a field used only by internal logic.
   */
  internal?: boolean;

  /**
   * This option will only be exposed to the user as a question in verbose mode.
   */
  verbose?: boolean;

  name: string;
  type: BooleanConstructor | StringConstructor | NumberConstructor | undefined;
}

export interface GeneratorQuestion {
  type: typeof Boolean | typeof String | typeof Number;
}
