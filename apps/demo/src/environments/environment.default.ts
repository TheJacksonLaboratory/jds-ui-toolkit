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
    strainRecommender: 'https://astra-dev.jax.org'
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
  };
  // feature flag
  showDevelopmentFeatures: boolean;
}