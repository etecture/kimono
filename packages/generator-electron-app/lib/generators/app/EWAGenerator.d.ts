import Generator from 'yeoman-generator';
import { EWAGeneratorOptions } from '../../types';
export default class EWAGenerator extends Generator {
    props?: EWAGeneratorOptions;
    constructor(args: string | string[], opts: {});
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): void;
}
//# sourceMappingURL=EWAGenerator.d.ts.map