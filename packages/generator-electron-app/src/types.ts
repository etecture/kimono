export interface EWAGeneratorOptions {
  projectName?: string;
  yes?: boolean;
  verbose?: boolean;
  install?: boolean;
  yarn?: boolean;
  git?: boolean;
  // pre-processors
  typescript?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  less?: boolean;
  sass?: boolean;
  // frameworks
  react?: boolean;
  vue?: boolean;
  // templates
  ejs?: boolean;
  nunjucks?: boolean;
  // misc
  webpack?: boolean;
  notifications?: boolean;
  // computed values
  projectNameCC?: string;
  // internal values
  electronWebpackConfig?: boolean;
  defaultRendererTemplate?: boolean;
}
