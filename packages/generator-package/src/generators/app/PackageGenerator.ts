import path from 'path';
import fs from 'fs-extra';

import Generator from 'yeoman-generator';
import yosay from 'yosay';
import symlinkDir from 'symlink-dir';

import { createTransformStream, createIgnoreGlobs, getFilePath, renderPath } from '@kimono/yo-transform-filenames';
import { binaryUtils, questionUtils, packageUtils, fsUtils, shellUtils } from '@kimono/yo-utils';
import { options as appOptions } from './options';
import { PackageGeneratorOptions } from '../../types';

import { doneMessage } from '../../doneMessage';

import { TemplateOptions } from './TemplateOptions';
const { name, version } = require('../../../package.json');

export default class PackageGenerator extends Generator {
  templateVars?: PackageGeneratorOptions;
  // cwd gets changed during the process. we remember the initial value.
  initialCwd: string;
  // files and folders we create and need to remove afterwards
  temporaryFiles: string[] = [];

  constructor(args: string | string[], opts: {}) {
    super(args, opts);
    this.initialCwd = process.cwd();
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

    this.templateVars = this._normalizeOptions(this.templateVars!);

    this.destinationRoot(path.resolve(this.templateVars.dest || '', this.templateVars.packageName!));
  }

  _normalizeName(context: PackageGeneratorOptions): PackageGeneratorOptions {
    let result = { ...context };

    // apply explicit scope override (when user provided a --scope option)
    if (this.options.scope) {
      const packageScope = this.options.scope;
      const { packageName } = packageUtils.splitName(result.projectName!);
      result.projectName = packageUtils.joinName({ packageScope, packageName });
    }

    // normalize projectScope, projectName and packageName
    result.projectName = packageUtils.normalizePackageName(result.projectName!);
    const { packageName, packageScope } = packageUtils.splitName(result.projectName!);
    result.packageName = packageName;
    result.packageScope = packageScope || '';

    // add case variants for the fields
    const fields = ['projectName', 'packageName', 'packageScope'];
    result = questionUtils.addCamelCased(result, fields);
    result = questionUtils.addPascalCased(result, fields);
    return result;
  }

  _normalizeOptions(context: PackageGeneratorOptions): PackageGeneratorOptions {
    let result = { ...context };

    result = questionUtils.applyImplicitOptions(result);
    result = this._normalizeName(result);

    // package.json "repository" field
    if (result.repositoryType || result.repositoryUrl) {
      result.repository = packageUtils.shake({ type: result.repositoryType, url: result.repositoryUrl });
    } else {
      result.repositoryType = '';
      result.repositoryUrl = '';
      result.repository = null;
    }

    // package.json "publishConfig" field
    if (result.publishAccess || result.publishRegistry) {
      result.publishConfig = packageUtils.shake({
        access: result.publishAccess,
        registry: result.publishRegistry
      });
    } else {
      result.publishAccess = '';
      result.publishRegistry = '';
      result.publishConfig = null;
    }

    // package.json dependencies fields
    if (result.private === undefined) result.private = false;
    if (!result.dependencies) result.dependencies = '';
    if (!result.devDependencies) result.devDependencies = '';
    if (!result.peerDependencies) result.peerDependencies = '';

    // custom dest dir
    if (result.dest) {
      if (result.dest.startsWith('.')) {
        result.dest = path.resolve(process.cwd(), result.dest);
      } else {
        result.dest = path.resolve(result.dest);
      }
    }

    // custom tpl dir
    if (result.tpl) {
      if (result.tpl.startsWith('.')) {
        result.tpl = path.resolve(process.cwd(), result.tpl);
      } else if (!result.tpl.endsWith('.git')) {
        result.tpl = path.resolve(result.tpl);
      }
    }

    return result;
  }

  async writing() {
    //--------------------------------------------------------------------
    // RESOLVE TEMPLATE FILES
    // The user may have provided a custom template location via --tpl
    // In case the --tpl value points to a git repo, we need to clone it
    //--------------------------------------------------------------------
    if (this.templateVars!.tpl) {
      if (this.templateVars!.tpl?.endsWith('.git')) {
        const tempDir = shellUtils.createTempDir(this.templateVars!.tpl);
        this.temporaryFiles.push(tempDir);
        await shellUtils.run(`cd ${tempDir} && git clone ${this.templateVars!.tpl} .`);
        this.sourceRoot(tempDir);
      } else {
        this.sourceRoot(this.templateVars!.tpl);
      }
    }
    if (this.templateVars!.dest) {
      fs.ensureDirSync(path.resolve(this.templateVars!.dest));
    }

    const context = this.templateVars as {};

    //--------------------------------------------------------------------
    // TEMPLATE CONFIG
    // The used template may or may not provide a kimono.json file with options
    // Regardless of whether it does, tplConfig will always be at least an empty object
    //--------------------------------------------------------------------
    const tplConfig: TemplateOptions = (await fsUtils.loadJSON(this.templatePath('kimono.json'))) || {};

    const ignoredGitFiles = [
      ...fsUtils.getFilesRecursively(this.templatePath('.git')),
      ...(await fsUtils.resolveGitIgnoredFiles(this.templatePath('.gitignore')))
    ];

    //--------------------------------------------------------------------
    // NESTED TEMPLATE FILES
    // The template can include templates itself (for providing template-based functionality to the end-user).
    // We shouldn't parse the EJS syntax in those "sub-template" files just yet.
    // The template may provide a "noparse" array of globs for those files, which we resolve to actual filenames
    //--------------------------------------------------------------------
    const ignoredSubTemplates = await fsUtils.resolveGlobs(tplConfig.noparse, { cwd: this.templatePath() });

    //--------------------------------------------------------------------
    // FILENAME TEMPLATE SYNTAX
    // - render custom EJS syntax in filenames using a transform stream
    // - create array of falsy file names after rendering (the files will be omitted)
    //--------------------------------------------------------------------
    this.registerTransformStream(createTransformStream(context, [...ignoredGitFiles, ...ignoredSubTemplates]));
    const ignoredConditionalFiles = (await createIgnoreGlobs(this.templatePath(), context)) as Set<string>;

    //--------------------------------------------------------------------
    // BINARY TEMPLATE FILES
    // template files that are binary (e.g. images) throw errors when they
    // are copied via copyTpl, because copyTpl tries to parse them as EJS text.
    // Therefore, we exclude them from fs.copyTpl and instead manually copy them later
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
    // COPY THE REGULAR TEMPLATE FILES
    //--------------------------------------------------------------------

    this.fs.copyTpl(
      [this.templatePath('**/*')] as any,
      this.destinationPath(),
      context,
      {},
      {
        globOptions: {
          dot: true,
          ignore: [...ignoredBinaryFiles, ...ignoredConditionalFiles, ...ignoredSubTemplates, ...ignoredGitFiles]
        }
      }
    );
  }

  async install() {
    const context = this.templateVars!;
    if (context.symlink) {
      const symlinkFrom = this.destinationPath();
      const symlinkTo = path.resolve(
        context.symlink.startsWith('.') ? this.initialCwd : '',
        context.symlink,
        context.packageScope || '',
        context.packageName!
      );
      fs.ensureDirSync(path.resolve(symlinkTo, '..'));
      symlinkDir(symlinkFrom, symlinkTo);
    }
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
      fs.writeFileSync(filePath, JSON.stringify(require(filePath), null, 2));
    }
  }

  async end() {
    for (const temp of this.temporaryFiles) {
      await shellUtils.run(`rm -rf ${temp}`);
    }
    this.temporaryFiles.length = 0;

    this._formatPackageJson();

    const messages = [
      'All right!',
      'Your package was created - have a look:',
      `cd ${fsUtils.forwardSlashes(this.destinationPath())}`
    ];
    const message = messages.filter(Boolean).join('\n');

    this.log(yosay(message));

    this.log(doneMessage);
  }
}
