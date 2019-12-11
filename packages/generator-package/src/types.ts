export interface PackageGeneratorOptions {
  tpl?: string;
  dest?: string;
  projectName?: string;
  packageName?: string;
  packageScope?: string;
  description?: string;
  yes?: boolean;
  verbose?: boolean;
  install?: boolean;
  yarn?: boolean;
  // --
  typescript?: boolean;
  private?: boolean;
  license?: string;
  homepage?: string;
  repository?: null | {
    url?: string;
    type?: string;
  };
  repositoryUrl?: string;
  repositoryType?: string;
  publishConfig?: null | {
    registry?: string;
    access?: '' | 'restricted' | 'publish';
  };
  publishRegistry?: string;
  publishAccess?: '' | 'restricted' | 'publish';
  dependencies?: string;
  devDependencies?: string;
  peerDependencies?: string;

  // computed values
  projectNameCC?: string;
}
