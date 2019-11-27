import path from 'path';
import fs from 'fs-extra';

import Generator from 'yeoman-generator';
import yosay from 'yosay';

import { EWAGeneratorOptions } from '../../types';
import { getBinaryFiles, getBinaryIgnoreGlobs } from '../../utils/binaryUtils';
import { initOptions, addComputedOptions, getAnswers, applyImplicitOptions } from '../../utils/questionsUtils';

import { createTransformStream, createIgnoreGlobs, getFilePath, renderPath } from '@kimono/yo-transform-filenames';
import { doneMessage } from '../../utils/doneMessage';
const { name, version } = require('../../../package.json');

if (process.env.NODE_ENV === 'development') console.log('EWAGenerator');

export default class EWAGenerator extends Generator {
  props?: EWAGeneratorOptions;

  constructor(args: string | string[], opts: {}) {
    super(args, opts);
    this.log(`${name}@${version} init`);
    this.sourceRoot(path.resolve(__dirname, '../../../templates'));

    this.argument('projectName', {
      type: String,
      required: false,
      description: 'Name for the new project'
    });
    initOptions(this);
  }

  async prompting() {
    const options = this.options as EWAGeneratorOptions;

    // take whatever CLI args values but add explicit scope and projectName
    const cliValues: EWAGeneratorOptions = { ...options };

    // prefill some default values for the questions
    const questionDefaults: EWAGeneratorOptions = {
      ...cliValues,
      projectName: options.projectName
    };

    try {
      let userOptions: EWAGeneratorOptions = await getAnswers(this, cliValues, questionDefaults);
      userOptions = applyImplicitOptions(userOptions);
      this.props = addComputedOptions(userOptions);
      this.destinationRoot(this.props.projectName);
    } catch (error) {
      this.log(`An error occurred: ${error.message}`);
      process.exit(1);
    }
  }
  async writing() {
    const context = this.props as {};

    //--------------------------------------------------------------------
    // FILENAME TEMPLATE SYNTAX
    // - render EJS syntax in filenames using a transform stream
    // - create array of skipped files that have falsy conditional names
    //--------------------------------------------------------------------
    this.registerTransformStream(createTransformStream(context));
    const ignoredConditionalFiles = (await createIgnoreGlobs(this.templatePath(), context)) as Set<string>;

    //--------------------------------------------------------------------
    // BINARY TEMPLATE FILES
    // template files that are binary throw errors when copied via copyTpl
    // we exclude them from fs.copyTpl and manually copy them instead
    //--------------------------------------------------------------------
    const binaryTemplateFiles = getBinaryFiles(this.templatePath(), ignoredConditionalFiles);
    binaryTemplateFiles.forEach((file: string) => {
      const rendered = renderPath(this.destinationPath(file), context);
      const src = this.templatePath(file);
      const dest = getFilePath(rendered);

      fs.ensureDirSync(path.dirname(dest));
      fs.copyFileSync(src, dest);
    });
    const ignoredBinaryFiles = getBinaryIgnoreGlobs(binaryTemplateFiles);

    //--------------------------------------------------------------------
    // COPY REGULAR TEMPLATE FILES
    //--------------------------------------------------------------------
    this.fs.copyTpl(
      [this.templatePath('**/*')] as any,
      this.destinationPath(),
      context,
      {},
      {
        globOptions: {
          dot: true,
          ignore: [...ignoredBinaryFiles, ...ignoredConditionalFiles]
        }
      }
    );
  }

  async install() {
    const props = this.props!;
    if (props.install) {
      if (props.yarn) {
        this.yarnInstall();
      } else {
        this.npmInstall();
      }
    }
    if (props.git) {
      const done = this.async();
      this.spawnCommand('git', ['init'], { cwd: this.destinationPath() }).on('close', done);
    }
  }

  end() {
    const props = this.props!;
    const messages = [
      'All right!',
      'Your project was created.',
      'Try it out:\n',
      `cd ${props.projectName}`,
      !props.install && (props.yarn ? 'yarn install' : 'npm install'),
      props.yarn ? 'yarn dev' : 'npm run dev'
    ];
    const message = messages.filter(Boolean).join('\n');

    this.log(yosay(message));

    this.log(doneMessage);
  }
}
