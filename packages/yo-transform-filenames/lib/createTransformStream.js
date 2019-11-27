"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_rename_1 = __importDefault(require("gulp-rename"));
const renderPath_1 = require("./renderPath");
const utils_1 = require("./utils");
function createTransformStream(context) {
    return gulp_rename_1.default((path) => {
        const filepath = utils_1.getFilePath(path);
        Object.assign(path, renderPath_1.renderPath(filepath, context));
    });
}
exports.createTransformStream = createTransformStream;
//# sourceMappingURL=createTransformStream.js.map