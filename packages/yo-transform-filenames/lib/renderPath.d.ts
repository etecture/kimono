import { ParsedPath } from 'gulp-rename';
export interface RenderedPath extends ParsedPath {
    ignore: boolean;
}
export declare function renderPath(candidate: string, context: Record<string, unknown>, options?: Record<string, unknown>): RenderedPath;
export declare function isFalsy(path: ParsedPath): boolean;
export declare function parsePath(path: string): ParsedPath;
//# sourceMappingURL=renderPath.d.ts.map