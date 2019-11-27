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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("../generators/app/options");
const camelcase = require("camelcase");
const validators = {
    required(value) {
        return value ? true : 'This field is required';
    }
};
function initOptions(generator) {
    options_1.options.forEach((_a) => {
        var { name, description } = _a, option = __rest(_a, ["name", "description"]);
        if (description && description.endsWith('?')) {
            description = description.substr(0, description.length - 1);
        }
        generator.option(name, Object.assign({ description }, option));
    });
}
exports.initOptions = initOptions;
function getQuestions(values) {
    const typeMap = {
        Boolean: 'confirm'
    };
    return [
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name',
            default: values.projectName,
            validate: validators.required
        },
        ...options_1.options
            .filter(option => !option.internal)
            .map(option => {
            return {
                name: option.name,
                type: (option.type && typeMap[option.type.name]) || 'input',
                default: values[option.name],
                message: option.description
            };
        })
    ];
}
function addComputedOptions(options) {
    return Object.assign(Object.assign({}, options), { projectNameCC: camelcase(options.projectName) });
}
exports.addComputedOptions = addComputedOptions;
const defaultInternalOptions = {
    electronWebpackConfig: false,
    defaultRendererTemplate: true
};
function getAnswers(generator, cliValues, defaults) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentQuestions = getQuestions(defaults);
        let currentResult = Object.assign(Object.assign({}, defaultInternalOptions), { projectName: cliValues.projectName });
        if (cliValues.projectName && cliValues.yes) {
            currentResult = Object.assign(Object.assign({}, currentResult), getDefaultAnswers(currentQuestions, defaults));
            return currentResult;
        }
        {
            const { result, questions } = yield askProjectNameQuestion({ currentResult, currentQuestions, generator });
            currentResult = result;
            currentQuestions = questions;
        }
        {
            const { result, questions, skipQuestions } = yield askSkipQuestion({
                currentResult,
                currentQuestions,
                generator,
                cliValues,
                defaults
            });
            currentResult = result;
            currentQuestions = questions;
            if (skipQuestions) {
                return currentResult;
            }
        }
        {
            const { result, questions } = yield askVerboseQuestion({
                currentResult,
                currentQuestions,
                generator,
                cliValues
            });
            currentResult = result;
            currentQuestions = questions;
        }
        const userQuestions = getUserQuestions(currentQuestions, cliValues);
        const userAnswers = yield generator.prompt(userQuestions);
        currentResult = Object.assign(Object.assign({}, currentResult), userAnswers);
        return currentResult;
    });
}
exports.getAnswers = getAnswers;
function askProjectNameQuestion({ currentResult: result, currentQuestions: questions, generator }) {
    return __awaiter(this, void 0, void 0, function* () {
        const nameQuestion = questions.find(question => question.name === 'projectName');
        if (nameQuestion) {
            questions = questions.filter(question => question !== nameQuestion);
        }
        if (nameQuestion && !result.projectName) {
            const { projectName } = yield generator.prompt(nameQuestion);
            result = Object.assign(Object.assign({}, result), { projectName });
        }
        return { result, questions };
    });
}
function askSkipQuestion({ currentResult: result, currentQuestions: questions, generator, cliValues, defaults }) {
    return __awaiter(this, void 0, void 0, function* () {
        let skipQuestions = false;
        const yesQuestion = questions.find(question => question.name === 'yes');
        if (yesQuestion) {
            questions = questions.filter(question => question !== yesQuestion);
            if (!cliValues.verbose) {
                const { yes } = yield generator.prompt(Object.assign(Object.assign({}, yesQuestion), { default: true }));
                if (yes) {
                    result = Object.assign(Object.assign({}, result), getDefaultAnswers(questions, defaults));
                    skipQuestions = true;
                }
            }
        }
        return { questions, result, skipQuestions };
    });
}
function askVerboseQuestion({ currentResult: result, currentQuestions: questions, generator, cliValues }) {
    return __awaiter(this, void 0, void 0, function* () {
        const verboseQuestion = questions.find(question => question.name === 'verbose');
        if (verboseQuestion) {
            questions = questions.filter(question => question !== verboseQuestion);
            if (!cliValues.verbose) {
                const { verbose } = yield generator.prompt(Object.assign(Object.assign({}, verboseQuestion), { default: false }));
                if (!verbose) {
                    const verboseDefaults = options_1.options
                        .filter(o => o.verbose)
                        .reduce((result, o) => Object.assign(result, { [o.name]: o.default }), {});
                    result = Object.assign(Object.assign({}, result), verboseDefaults);
                }
            }
        }
        return { result, questions };
    });
}
function getUserQuestions(questions, cliValues) {
    const filters = [
        function internalFilter(question) {
            const option = options_1.options.find(o => o.name === question.name);
            return !(option && option.internal);
        },
        function verboseFilter(question) {
            const option = options_1.options.find(o => o.name === question.name);
            if (option && option.verbose) {
                return cliValues.verbose || false;
            }
            return true;
        }
    ];
    const userQuestions = questions.reduce((result, question) => {
        if (filters.every(filter => filter(question))) {
            result.push(question);
        }
        return result;
    }, []);
    return userQuestions;
}
function getDefaultAnswers(questions, defaults) {
    return questions.reduce((result, question) => {
        const name = question.name;
        const value = defaults[name] || question.default;
        if (value === undefined) {
            return result;
        }
        return Object.assign(Object.assign({}, result), { [name]: value });
    }, {});
}
function applyImplicitOptions(options) {
    if (options.react) {
        if (!options.webpack)
            logImplicitOverrides({ react: { webpack: true } });
        options.webpack = true;
        options.defaultRendererTemplate = false;
    }
    if (options.vue) {
        options.defaultRendererTemplate = false;
    }
    if (options.webpack) {
        options.electronWebpackConfig = true;
    }
    return options;
}
exports.applyImplicitOptions = applyImplicitOptions;
function logImplicitOverrides(dependencies) {
    console.log('');
    console.info('Overriding user choices:');
    Object.entries(dependencies).forEach(([reason, overrides]) => {
        console.info(`  - ${reason} requires`);
        Object.entries(overrides).forEach(([override, value]) => {
            console.info(`      - ${override}=${value}`);
        });
    });
    console.log('');
}
//# sourceMappingURL=questionsUtils.js.map