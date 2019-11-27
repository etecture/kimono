"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const shellUtils_1 = require("./shellUtils");
exports.MAGIC_DEFAULT_SCOPE = '@@';
exports.DEFAULT_SCOPE = '@mono';
function normalize(name) {
    let { packageScope, packageName } = splitName(name);
    if (packageScope && packageScope[0] !== '@') {
        packageScope = `@${packageScope}`;
    }
    if (packageScope === exports.MAGIC_DEFAULT_SCOPE) {
        packageScope = exports.DEFAULT_SCOPE;
    }
    return joinName({ packageScope, packageName });
}
exports.normalize = normalize;
function splitName(name) {
    let packageName = '';
    let packageScope = '';
    if (name) {
        [packageScope, packageName] = name.split('/');
        if (packageScope && !packageName) {
            packageName = packageScope;
            packageScope = '';
        }
    }
    return { packageName, packageScope };
}
exports.splitName = splitName;
function joinName({ packageName, packageScope }) {
    if (!packageName) {
        throw new Error('packageName is required');
    }
    if (packageScope) {
        return `${packageScope}/${packageName}`;
    }
    return packageName;
}
exports.joinName = joinName;
function getGeneratorPackageName(name, PREFIX = 'generator-') {
    let { packageScope, packageName } = splitName(name);
    packageName = packageName.startsWith(PREFIX) ? packageName : `${PREFIX}${packageName}`;
    return normalize(joinName({ packageScope, packageName }));
}
exports.getGeneratorPackageName = getGeneratorPackageName;
function getGeneratorYoName(name, PREFIX = 'generator-') {
    name = getGeneratorPackageName(name);
    name = name.replace(PREFIX, '');
    return name;
}
exports.getGeneratorYoName = getGeneratorYoName;
function getGeneratorNames(name) {
    const packageName = getGeneratorPackageName(name);
    const yoName = getGeneratorYoName(name);
    return {
        yoName,
        packageName
    };
}
exports.getGeneratorNames = getGeneratorNames;
function runGenerator(generatorName, generatorArgs = [], yo) {
    return new Promise((resolve, reject) => {
        try {
            yo.lookup(() => yo.run([generatorName, ...generatorArgs], resolve));
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.runGenerator = runGenerator;
function resolvePackagePath(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jsonPath = require.resolve(`${name}/package.json`);
            const packagePath = path_1.default.dirname(jsonPath);
            return packagePath;
        }
        catch (err) {
            return null;
        }
    });
}
exports.resolvePackagePath = resolvePackagePath;
function isPackageInstalled(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const packagePath = yield resolvePackagePath(name);
        return packagePath !== null;
    });
}
exports.isPackageInstalled = isPackageInstalled;
function installPackage(name, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!force && (yield isPackageInstalled(name))) {
            console.log(`>> package ${name} is already installed`);
            return;
        }
        console.log(`>> install package ${name}`);
        yield shellUtils_1.run(`npm install --global ${name}`);
    });
}
exports.installPackage = installPackage;
function joinAuthor({ authorName, authorEmail }) {
    if (authorName && authorEmail) {
        return `${authorName} <${authorEmail}>`;
    }
    return authorName;
}
exports.joinAuthor = joinAuthor;
function downloadPackage(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const dir = shellUtils_1.createTempDir(name);
        const { stdout: packLog } = yield shellUtils_1.exec(`cd ${dir} && npm pack ${name}`);
        const filename = packLog
            .split('/')
            .pop()
            .trim();
        if (filename) {
            yield shellUtils_1.exec(`cd ${dir} && tar -zxvf ${filename}`);
            return dir;
        }
        return null;
    });
}
exports.downloadPackage = downloadPackage;
//# sourceMappingURL=packageUtils.js.map