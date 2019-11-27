import { Delimiters } from './Delimiters';
export declare function createReplacement(value: string): RegExp;
export declare const replacements: {
    [Delimiters.OPENING_BRACKET_EJS]: RegExp;
    [Delimiters.CLOSING_BRACKET_EJS]: RegExp;
    [Delimiters.BINARY_AND_OPERATOR_EJS]: RegExp;
    [Delimiters.BINARY_OR_OPERATOR_EJS]: RegExp;
    [Delimiters.TERNARY_AND_OPERATOR_EJS]: RegExp;
    [Delimiters.TERNARY_OR_OPERATOR_EJS]: RegExp;
};
export declare function normalizeSyntax(value: string): string;
//# sourceMappingURL=normalize.d.ts.map