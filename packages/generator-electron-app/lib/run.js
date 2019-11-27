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
const yeoman_environment_1 = __importDefault(require("yeoman-environment"));
function run({ argv = process.argv.slice() } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const args = argv.slice(2);
            const env = yeoman_environment_1.default.createEnv();
            yield runGenerator('@kimono/electron-app', args, env);
            process.exit(0);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    });
}
exports.default = run;
function runGenerator(generatorName, generatorArgs = [], yoenv) {
    return new Promise((resolve, reject) => {
        try {
            yoenv.lookup(() => yoenv.run([generatorName, ...generatorArgs], resolve));
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.runGenerator = runGenerator;
//# sourceMappingURL=run.js.map