"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Delimiters_1 = require("./Delimiters");
function createReplacement(value) {
    return new RegExp(value.replace(/\+/g, '\\+'), 'g');
}
exports.createReplacement = createReplacement;
exports.replacements = {
    [Delimiters_1.Delimiters.OPENING_BRACKET_EJS]: createReplacement(Delimiters_1.Delimiters.OPENING_BRACKET_FS),
    [Delimiters_1.Delimiters.CLOSING_BRACKET_EJS]: createReplacement(Delimiters_1.Delimiters.CLOSING_BRACKET_FS),
    [Delimiters_1.Delimiters.BINARY_AND_OPERATOR_EJS]: createReplacement(Delimiters_1.Delimiters.BINARY_AND_OPERATOR_FS),
    [Delimiters_1.Delimiters.BINARY_OR_OPERATOR_EJS]: createReplacement(Delimiters_1.Delimiters.BINARY_OR_OPERATOR_FS),
    [Delimiters_1.Delimiters.TERNARY_AND_OPERATOR_EJS]: createReplacement(Delimiters_1.Delimiters.TERNARY_AND_OPERATOR_FS),
    [Delimiters_1.Delimiters.TERNARY_OR_OPERATOR_EJS]: createReplacement(Delimiters_1.Delimiters.TERNARY_OR_OPERATOR_FS)
};
function normalizeSyntax(value) {
    return (value &&
        Object.entries(exports.replacements).reduce((result, [replacement, occurence]) => result.replace(occurence, replacement), value));
}
exports.normalizeSyntax = normalizeSyntax;
//# sourceMappingURL=normalize.js.map