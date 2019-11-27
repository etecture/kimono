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
const fs_extra_1 = __importDefault(require("fs-extra"));
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const yosay_1 = __importDefault(require("yosay"));
const binaryUtils_1 = require("../../utils/binaryUtils");
const questionsUtils_1 = require("../../utils/questionsUtils");
const yo_transform_filenames_1 = require("@kimono/yo-transform-filenames");
const doneMessage_1 = require("../../utils/doneMessage");
const { name, version } = require('../../../package.json');
if (process.env.NODE_ENV === 'development')
    console.log('EWAGenerator');
class EWAGenerator extends yeoman_generator_1.default {
    constructor(args, opts) {
        super(args, opts);
        this.log(`${name}@${version} init`);
        this.sourceRoot(path_1.default.resolve(__dirname, '../../../templates'));
        this.argument('projectName', {
            type: String,
            required: false,
            description: 'Name for the new project'
        });
        questionsUtils_1.initOptions(this);
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.options;
            const cliValues = Object.assign({}, options);
            const questionDefaults = Object.assign(Object.assign({}, cliValues), { projectName: options.projectName });
            try {
                let userOptions = yield questionsUtils_1.getAnswers(this, cliValues, questionDefaults);
                userOptions = questionsUtils_1.applyImplicitOptions(userOptions);
                this.props = questionsUtils_1.addComputedOptions(userOptions);
                this.destinationRoot(this.props.projectName);
            }
            catch (error) {
                this.log(`An error occurred: ${error.message}`);
                process.exit(1);
            }
        });
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.props;
            this.registerTransformStream(yo_transform_filenames_1.createTransformStream(context));
            const ignoredConditionalFiles = (yield yo_transform_filenames_1.createIgnoreGlobs(this.templatePath(), context));
            const binaryTemplateFiles = binaryUtils_1.getBinaryFiles(this.templatePath(), ignoredConditionalFiles);
            binaryTemplateFiles.forEach((file) => {
                const rendered = yo_transform_filenames_1.renderPath(this.destinationPath(file), context);
                const src = this.templatePath(file);
                const dest = yo_transform_filenames_1.getFilePath(rendered);
                fs_extra_1.default.ensureDirSync(path_1.default.dirname(dest));
                fs_extra_1.default.copyFileSync(src, dest);
            });
            const ignoredBinaryFiles = binaryUtils_1.getBinaryIgnoreGlobs(binaryTemplateFiles);
            this.fs.copyTpl([this.templatePath('**/*')], this.destinationPath(), context, {}, {
                globOptions: {
                    dot: true,
                    ignore: [...ignoredBinaryFiles, ...ignoredConditionalFiles]
                }
            });
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            const props = this.props;
            if (props.install) {
                if (props.yarn) {
                    this.yarnInstall();
                }
                else {
                    this.npmInstall();
                }
            }
            if (props.git) {
                const done = this.async();
                this.spawnCommand('git', ['init'], { cwd: this.destinationPath() }).on('close', done);
            }
        });
    }
    end() {
        const props = this.props;
        const messages = [
            'All right!',
            'Your project was created.',
            'Try it out:\n',
            `cd ${props.projectName}`,
            !props.install && (props.yarn ? 'yarn install' : 'npm install'),
            props.yarn ? 'yarn dev' : 'npm run dev'
        ];
        const message = messages.filter(Boolean).join('\n');
        this.log(yosay_1.default(message));
        this.log(doneMessage_1.doneMessage);
    }
}
exports.default = EWAGenerator;
//# sourceMappingURL=EWAGenerator.js.map