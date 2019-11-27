"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const normalize_1 = require("./normalize");
function renderPath(candidate, context, options = {}) {
    const original = parsePath(candidate);
    const rendered = ejs_1.default.render(normalize_1.normalizeSyntax(candidate), context, options);
    const parsed = parsePath(rendered);
    const ignore = isFalsy(parsed);
    return Object.assign({ ignore }, (ignore ? original : parsed));
}
exports.renderPath = renderPath;
function isFalsy(path) {
    return ['false', 'undefined', 'null', '0'].some(value => {
        if (path.dirname) {
            if (path.dirname === value) {
                return true;
            }
            if (path.dirname.includes(`/${value}`) || path.dirname.includes(`\\${value}`)) {
                return true;
            }
        }
        if (path.basename === value) {
            return true;
        }
        return false;
    });
}
exports.isFalsy = isFalsy;
function parsePath(path) {
    const extname = path_1.default.extname(path);
    const dirname = path_1.default.dirname(path);
    const basename = path_1.default.basename(path, extname);
    return {
        dirname,
        basename,
        extname
    };
}
exports.parsePath = parsePath;
//# sourceMappingURL=renderPath.js.map