"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function getFilePath(filePath) {
    const dirname = filePath.dirname;
    const basename = filePath.basename;
    const dot = (filePath.extname && (filePath.extname.startsWith('.') ? '' : '.')) || '';
    const extname = (filePath.extname && `${dot}${filePath.extname}`) || filePath.extname;
    return `${dirname}${path_1.default.sep}${basename}${extname}`;
}
exports.getFilePath = getFilePath;
//# sourceMappingURL=utils.js.map