import path from 'path';
import fs from 'fs-extra';

import Generator from 'yeoman-generator';
import yosay from 'yosay';

import { createTransformStream, createIgnoreGlobs, getFilePath, renderPath } from '@kimono/yo-transform-filenames';
import { binaryUtils, questionUtils, packageUtils } from '@kimono/yo-utils';

import { options as appOptions } from './options';
import { PackageGeneratorOptions } from '../../types';

import { doneMessage } from '../../doneMessage';
const { name, version } = require('../../../package.json');

export default class PackageGenerator extends Generator {
  templateVars?: PackageGeneratorOptions;

  constructor(args: string | string[], opts: {}) {
    super(args, opts);
    this.sourceRoot(path.resolve(__dirname, '../../../templates'));

    this.log(`${name}@${version} init`);
    this.argument('projectName', {
      type: String,
      required: false,
      description: 'Name for the new project'
    });
    questionUtils.initOptions(this, appOptions);
  }

  async prompting() {
    const options = this.options as PackageGeneratorOptions;
    // take whatever CLI args values but add explicit scope and projectName
    const cliValues: PackageGeneratorOptions = { ...options };

    // prefill some default values for the questions
    const questionDefaults: PackageGeneratorOptions = {
      ...cliValues,
      projectName: options.projectName
    };

    try {
      this.templateVars = await questionUtils.getAnswers(this, cliValues, questionDefaults, appOptions);
    } catch (error) {
      this.log(`An error occurred: ${error.message}`);
      process.exit(1);
    }

    this.templateVars = this._finalizeContext(this.templateVars!);

    // set target folder, but only use the package name part, ignoring the scope part
    this.destinationRoot(packageUtils.splitName(this.templateVars.projectName!).packageName);
  }

  _finalizeContext(context: PackageGeneratorOptions): PackageGeneratorOptions {
    let result = { ...context };

    result = questionUtils.applyImplicitOptions(result);
    result.projectName = packageUtils.normalizePackageName(result.projectName!);

    // some values must be computed or derived based on the given values
    result = questionUtils.addCamelCased(result, ['projectName']);

    // package.json repository
    if (result.repositoryType || result.repositoryUrl) {
      result.repository = packageUtils.shake({ type: result.repositoryType, url: result.repositoryUrl });
    } else {
      result.repository = null;
    }

    // package.json publishConfig
    if (result.publishAccess || result.publishRegistry) {
      result.publishConfig = packageUtils.shake({
        access: result.publishAccess,
        registry: result.publishRegistry
      });
    } else {
      result.publishConfig = null;
    }

    // package.json dependencies
    if (!result.dependencies) result.dependencies = '';
    if (!result.devDependencies) result.devDependencies = '';
    if (!result.peerDependencies) result.peerDependencies = '';

    // custom tpl dir
    if (result.tpl) {
      if (result.tpl.startsWith('./')) {
        result.tpl = path.resolve(process.cwd(), result.tpl);
      } else {
        result.tpl = path.resolve(result.tpl);
      }
    }

    return result;
  }
  async writing() {
    if (this.templateVars!.tpl) {
      this.sourceRoot(this.templateVars!.tpl);
    }
    const context = this.templateVars as {};
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
    const binaryTemplateFiles = binaryUtils.getBinaryFiles(this.templatePath(), ignoredConditionalFiles);
    binaryTemplateFiles.forEach((file: string) => {
      const rendered = renderPath(this.destinationPath(file), context);
      const src = this.templatePath(file);
      const dest = getFilePath(rendered);

      fs.ensureDirSync(path.dirname(dest));
      fs.copyFileSync(src, dest);
    });
    const ignoredBinaryFiles = binaryUtils.getBinaryIgnoreGlobs(binaryTemplateFiles);

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
    const context = this.templateVars!;
    if (context.install) {
      if (context.yarn) {
        this.yarnInstall();
      } else {
        this.npmInstall();
      }
    }
  }

  _formatPackageJson() {
    const filePath = path.resolve(this.destinationPath('package.json'));
    if (fs.pathExistsSync(filePath)) {
      // re-format package.json
      const pkg = require(filePath);
      this.fs.write(filePath, JSON.stringify(pkg, null, 2));
    } else {
      console.warn('>> package.json not found in output directory!', filePath);
    }
  }

  end() {
    this._formatPackageJson();
    const context = this.templateVars!;

    const messages = [
      'All right!',
      'Your package was created.',
      'Try it out:\n',
      `cd ${context.projectName}`,
      !context.install && (context.yarn ? 'yarn install' : 'npm install'),
      context.yarn ? 'yarn dev' : 'npm run dev'
    ];
    const message = messages.filter(Boolean).join('\n');

    this.log(yosay(message));

    this.log(doneMessage);
  }
}
