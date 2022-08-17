export enum FeatureLevel{
    production='production',
    staging='staging',
    development='development'
}

const featureLevelValue = Object.freeze({
  development: 0,
  staging: 1,
  production: 2,
});

export interface Config {
    apiHost:string;
    featureLevel:FeatureLevel;
}

const prod: Config = Object.freeze({
  apiHost: 'https://d2eidk0cuzevtk.cloudfront.net',
  featureLevel: FeatureLevel.production,
});

const stage: Config = Object.freeze({
  apiHost: 'https://d2eidk0cuzevtk.cloudfront.net',
  featureLevel: FeatureLevel.staging,
});

const dev: Config = Object.freeze({
  apiHost: 'https://d2eidk0cuzevtk.cloudfront.net',
  featureLevel: FeatureLevel.development,
});

let env: Config;

switch (process.env.ENV_NAME) {
  case 'prod':
    env = { ...prod };
    break;
  case 'stage':
    env = { ...stage };
    break;
  default:
    env = { ...dev };
    break;
}

export const config = Object.freeze({ ...env });

export const isApplicableFeatureLevel = (level:FeatureLevel):boolean => (
  featureLevelValue[config.featureLevel] <= featureLevelValue[level]
);
