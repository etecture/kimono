import YoEnv from 'yeoman-environment';
import { RunGeneratorOptions } from '@kimono/yo-utils/lib/types';

export default async function run({ argv = process.argv.slice() }: RunGeneratorOptions = {}) {
  try {
    const args = argv.slice(2);
    const env = YoEnv.createEnv();
    await runGenerator('@kimono/electron-app', args, env);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export function runGenerator(generatorName: string, generatorArgs: string[] = [], yoenv: YoEnv): Promise<Error | null> {
  return new Promise((resolve, reject) => {
    try {
      yoenv.lookup(() => yoenv.run([generatorName, ...generatorArgs], resolve));
    } catch (error) {
      reject(error);
    }
  });
}
