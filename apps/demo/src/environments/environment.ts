import { Environment } from './environment.default';

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
    // ISAModelData: 'https://jds-apps-dev.jax.org/api/v1',
    ISAModelData: 'http://localhost:28080/data-orchestration/api',
  },
  showDevelopmentFeatures: true,
};
