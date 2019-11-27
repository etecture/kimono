export declare const Delimiters: {
    VARNAME_START: string;
    BOOLEAN_AND: string;
    TERNARY_AND: string;
    TERNARY_OR: string;
};
export declare const DEFAULT_CONDITIONAL_SYNTAX_REGEXP: RegExp;
export declare const DEFAULT_CREATE_IGNORE_GLOBS: (key: string, value: unknown) => string[];
export declare function getConditionalSyntaxIgnoreGlobs(context: {}, createGlob?: (key: string, value: unknown) => string[]): string[];
//# sourceMappingURL=conditionalSyntax.d.ts.map