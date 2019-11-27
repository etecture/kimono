import { Delimiters } from './Delimiters';

export function createReplacement(value: string): RegExp {
  return new RegExp(value.replace(/\+/g, '\\+'), 'g');
}
export const replacements = {
  [Delimiters.OPENING_BRACKET_EJS]: createReplacement(Delimiters.OPENING_BRACKET_FS),
  [Delimiters.CLOSING_BRACKET_EJS]: createReplacement(Delimiters.CLOSING_BRACKET_FS),
  [Delimiters.BINARY_AND_OPERATOR_EJS]: createReplacement(Delimiters.BINARY_AND_OPERATOR_FS),
  [Delimiters.BINARY_OR_OPERATOR_EJS]: createReplacement(Delimiters.BINARY_OR_OPERATOR_FS),
  [Delimiters.TERNARY_AND_OPERATOR_EJS]: createReplacement(Delimiters.TERNARY_AND_OPERATOR_FS),
  [Delimiters.TERNARY_OR_OPERATOR_EJS]: createReplacement(Delimiters.TERNARY_OR_OPERATOR_FS)
};

/**
 * Replaces the bracketStrings used in filesystem templates with the ones used in EJS templates
 * @param value
 */
export function normalizeSyntax(value: string): string {
  return (
    value &&
    Object.entries(replacements).reduce(
      (result, [replacement, occurence]) => result.replace(occurence, replacement),
      value
    )
  );
}
