// this default environment is used for tests in the build pipeline
export const environment: Environment = {
  production: false,
  version: require('../../package.json').version,
  auth: {
    audience: 'https://cube.jax.org',
    domain: 'thejacksonlaboratory.auth0.com',
    clientId: 'SrKiPbqYqWbfAZODolg2gwgcAtAs0ZmY',
  },
  urls: {
    geneWeaver: 'https://geneweaver-dev.jax.org',
    strainRecommender: 'https://astra-dev.jax.org',
    ISAModelData: 'https://jds-apps-dev.jax.org/api/v1'
  },
  // feature flag
  showDevelopmentFeatures: true,
}

export interface Environment {
  production: boolean;
  version: string;
  auth: {
    audience: string;
    domain: string;
    clientId: string;
  };
  urls: {
    geneWeaver: string;
    strainRecommender: string;
    ISAModelData: string;
  };
  // feature flag
  showDevelopmentFeatures: boolean;
}