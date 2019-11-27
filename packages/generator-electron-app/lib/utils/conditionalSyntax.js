"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delimiters = {
    VARNAME_START: '%',
    BOOLEAN_AND: ' && ',
    TERNARY_AND: ' == ',
    TERNARY_OR: ' !! '
};
exports.DEFAULT_CONDITIONAL_SYNTAX_REGEXP = new RegExp(`(.*)${exports.Delimiters.VARNAME_START}(.*)(${exports.Delimiters.BOOLEAN_AND}|${exports.Delimiters.TERNARY_AND})(.*)(?:${exports.Delimiters.TERNARY_OR})?(.*)?`);
exports.DEFAULT_CREATE_IGNORE_GLOBS = (key, value) => {
    const varname = value ? `!${key}` : key;
    const glob = `**/*${exports.Delimiters.VARNAME_START}${varname}${exports.Delimiters.BOOLEAN_AND}*`;
    return [glob, `${glob}/*`];
};
function getConditionalSyntaxIgnoreGlobs(context, createGlob = exports.DEFAULT_CREATE_IGNORE_GLOBS) {
    return Object.entries(context).reduce((result, [key, value]) => {
        const globs = createGlob(key, value);
        return [...result, ...(Array.isArray(globs) ? globs : [globs])];
    }, []);
}
exports.getConditionalSyntaxIgnoreGlobs = getConditionalSyntaxIgnoreGlobs;
//# sourceMappingURL=conditionalSyntax.js.map