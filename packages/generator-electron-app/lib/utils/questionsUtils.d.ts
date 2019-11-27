import { EWAGeneratorOptions } from '../types';
import Generator from 'yeoman-generator';
export declare function initOptions(generator: Generator): void;
export declare function addComputedOptions(options: EWAGeneratorOptions): EWAGeneratorOptions;
export declare function getAnswers(generator: Generator, cliValues: EWAGeneratorOptions, defaults: EWAGeneratorOptions): Promise<EWAGeneratorOptions>;
export declare function applyImplicitOptions(options: EWAGeneratorOptions): EWAGeneratorOptions;
//# sourceMappingURL=questionsUtils.d.ts.map