import Generator, { Question, Answers } from 'yeoman-generator';
import camelcase from 'camelcase';
import { GeneratorOptions, GeneratorOption } from './types';

const validators = {
  required(value: string): boolean | string {
    return value ? true : 'This field is required';
  }
};

export function initOptions(generator: Generator, appOptions: GeneratorOption[]) {
  appOptions.forEach(({ name, description, ...option }) => {
    if (description && description.endsWith('?')) {
      description = description.substr(0, description.length - 1);
    }
    generator.option(name, { description, ...option });
  });
}

function getQuestions(values: GeneratorOptions, appOptions: GeneratorOption[]): Question[] {
  const typeMap: Record<string, string> = {
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
    ...appOptions
      .filter(option => !option.internal)
      .map(option => {
        return {
          name: option.name,
          type: (option.type && typeMap[option.type.name]) || 'input',
          default: (values as Record<string, any>)[option.name],
          message: option.description
        } as Question;
      })
  ];
}

/**
 * Adds camel-cased value variants
 * @param data The current generator options
 * @param fields Names of properties to convert
 * @return the extended generator options
 */
export function addCamelCased(data: GeneratorOptions, fields: string[]): GeneratorOptions {
  return addCasedVariants(data, {
    fields,
    keyFunc: (key: string) => `${key}CC`,
    pascalCase: false
  });
}

/**
 * Adds pascal-cased value variants
 * @param data The current generator options
 * @param fields Names of properties to convert
 * @return the extended generator options
 */
export function addPascalCased(data: GeneratorOptions, fields: string[]): GeneratorOptions {
  return addCasedVariants(data, {
    fields,
    keyFunc: (key: string) => `${key}PC`,
    pascalCase: true
  });
}

/**
 * Adds custom or computed values with a changed case
 * @param data given yo questions and answers object
 * @param options options object
 * @param options.fields An array of property names to create camelcased values from
 * @param options.keyFunc A function that generates the name for the newly created properties. Appends `CC` by default.
 * @param options.pascalCase Whether to use pascal case (capitalized first letter)
 * @return new, extended yo questions and answers object
 */
export function addCasedVariants(
  data: GeneratorOptions,
  {
    fields,
    keyFunc,
    pascalCase
  }: {
    fields: string[];
    keyFunc: (key: string) => string;
    pascalCase?: boolean;
  }
): GeneratorOptions {
  const result = {
    ...data,
    ...fields.reduce((result, key) => {
      if (!data[key]) {
        return result;
      }
      const value = data[key].replace('@', '_').replace('/', '--');
      return {
        ...result,
        [keyFunc(key)]: camelcase(value, { pascalCase })
      };
    }, {})
  };
  return result;
}

const defaultInternalOptions: GeneratorOptions = {
  electronWebpackConfig: false,
  defaultRendererTemplate: true
};

export async function getAnswers(
  generator: Generator,
  cliValues: GeneratorOptions,
  defaults: GeneratorOptions,
  appOptions: GeneratorOption[]
): Promise<GeneratorOptions> {
  let currentQuestions = getQuestions(defaults, appOptions);
  let currentResult: GeneratorOptions = {
    ...defaultInternalOptions,
    projectName: cliValues.projectName
  };

  if (cliValues.projectName && cliValues.yes) {
    // earliest exit: projectName is given, yes is specified; use defaults
    currentResult = { ...currentResult, ...getDefaultAnswers(currentQuestions, defaults) };
    return currentResult;
  }

  {
    const { result, questions } = await askProjectNameQuestion({ currentResult, currentQuestions, generator });
    currentResult = result;
    currentQuestions = questions;
  }

  {
    const { result, questions, skipQuestions } = await askSkipQuestion({
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
    const { result, questions } = await askVerboseQuestion({
      appOptions,
      currentResult,
      currentQuestions,
      generator,
      cliValues
    });
    currentResult = result;
    currentQuestions = questions;
  }

  const userQuestions = getUserQuestions(appOptions, currentQuestions, cliValues);
  const userAnswers = await generator.prompt(userQuestions);
  currentResult = { ...currentResult, ...userAnswers };

  return currentResult;
}

interface QuestionModifierArgs {
  currentResult: GeneratorOptions;
  currentQuestions: Question[];
  generator: Generator;
}
interface QuestionModifierResult {
  result: GeneratorOptions;
  questions: Question[];
}

async function askProjectNameQuestion({
  currentResult: result,
  currentQuestions: questions,
  generator
}: QuestionModifierArgs): Promise<QuestionModifierResult> {
  const nameQuestion = questions.find(question => question.name === 'projectName');
  if (nameQuestion) {
    questions = questions.filter(question => question !== nameQuestion);
  }

  if (nameQuestion && !result.projectName) {
    const { projectName } = await generator.prompt(nameQuestion);
    result = { ...result, projectName };
  }

  return { result, questions };
}

interface SkipQuestionArgs extends QuestionModifierArgs {
  cliValues: GeneratorOptions;
  defaults: GeneratorOptions;
}
interface SkipQuestionResult extends QuestionModifierResult {
  skipQuestions: boolean;
}

async function askSkipQuestion({
  currentResult: result,
  currentQuestions: questions,
  generator,
  cliValues,
  defaults
}: SkipQuestionArgs): Promise<SkipQuestionResult> {
  // ask the user if he would like to skip the questions
  let skipQuestions = false;
  const yesQuestion = questions.find(question => question.name === 'yes');
  if (yesQuestion) {
    questions = questions.filter(question => question !== yesQuestion);
    if (!cliValues.verbose) {
      const { yes } = await generator.prompt({ ...yesQuestion, default: true });
      if (yes) {
        // second earliest exit: projectName is given, user chose to skip questions; use defaults
        result = { ...result, ...getDefaultAnswers(questions, defaults) };
        skipQuestions = true;
      }
    }
  }
  return { questions, result, skipQuestions };
}

interface VerboseQuestionArgs extends QuestionModifierArgs {
  cliValues: GeneratorOptions;
  appOptions: GeneratorOption[];
}
async function askVerboseQuestion({
  currentResult: result,
  currentQuestions: questions,
  appOptions,
  generator,
  cliValues
}: VerboseQuestionArgs): Promise<QuestionModifierResult> {
  // ask the user if he wants to answer all questions (verbose) or just the common ones
  const verboseQuestion = questions.find(question => question.name === 'verbose');
  if (verboseQuestion) {
    questions = questions.filter(question => question !== verboseQuestion);
    if (!cliValues.verbose) {
      const { verbose } = await generator.prompt({ ...verboseQuestion, default: false });
      // when user does NOT choose verbose, use default values for the verbose options
      if (!verbose) {
        const verboseDefaults = appOptions
          .filter(o => o.verbose)
          .reduce((result, o) => Object.assign(result, { [o.name]: o.default }), {});
        result = { ...result, ...verboseDefaults };
      }
    }
  }
  return { result, questions };
}

function getUserQuestions(appOptions: GeneratorOption[], questions: Question[], cliValues: GeneratorOptions) {
  const filters = [
    // internal options should never be asked via questions
    function internalFilter(question: Question): boolean {
      const option = appOptions.find(o => o.name === question.name);
      return !(option && option.internal);
    },
    // verbose options should only be asked when the verbose flag is set
    function verboseFilter(question: Question): boolean {
      const option: GeneratorOption = appOptions.find(o => o.name === question.name) as GeneratorOption;
      if (option && option.verbose) {
        return cliValues.verbose || false;
      }
      return true;
    }
  ];
  const userQuestions = questions.reduce((result: Question[], question: Question) => {
    if (filters.every(filter => filter(question))) {
      result.push(question);
    }
    return result;
  }, []);

  return userQuestions;
}

function getDefaultAnswers(questions: Question[], defaults: GeneratorOptions): Answers {
  return questions.reduce((result, question) => {
    const name = question.name as string;
    const value = (defaults as any)[name] || question.default;
    if (value === undefined) {
      return result;
    }
    return {
      ...result,
      [name]: value
    };
  }, {});
}

export function applyImplicitOptions(options: GeneratorOptions): GeneratorOptions {
  if (options.react) {
    if (!options.webpack) logImplicitOverrides({ react: { webpack: true } });
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

function logImplicitOverrides(dependencies: Record<string, Record<string, unknown>>): void {
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
