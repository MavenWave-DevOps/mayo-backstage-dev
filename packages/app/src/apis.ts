import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';
import {
  costInsightsApiRef,
  ExampleCostInsightsClient,
} from '@backstage/plugin-cost-insights';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  // discoveryApiRef,
  errorApiRef,
  githubAuthApiRef,
  // oauthRequestApiRef,
} from '@backstage/core-plugin-api';
// import { GithubAuth } from '@backstage/core-app-api';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  // createApiFactory({
  //   api: githubAuthApiRef,
  //   deps: {
  //     configApi: configApiRef,
  //     discoveryApi: discoveryApiRef,
  //     oauthRequestApi: oauthRequestApiRef,
  //   },
  //   factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
  //     GithubAuth.create({
  //       discoveryApi,
  //       oauthRequestApi,
  //       defaultScopes: ['read:user'],
  //       environment: configApi.getString('auth.environment'),
  //     }),
  // }),
  createApiFactory({
    api: graphQlBrowseApiRef,
    deps: { errorApi: errorApiRef, githubAuthApi: githubAuthApiRef },
    factory: ({ errorApi, githubAuthApi }) =>
      GraphQLEndpoints.from([
        GraphQLEndpoints.github({
          id: 'github',
          title: 'GitHub',
          errorApi,
          githubAuthApi,
        }),
        GraphQLEndpoints.create({
          id: 'gitlab',
          title: 'GitLab',
          url: 'https://gitlab.com/api/graphql',
        }),
        GraphQLEndpoints.create({
          id: 'swapi',
          title: 'SWAPI',
          url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
        }),
      ]),
  }),
  createApiFactory(costInsightsApiRef, new ExampleCostInsightsClient()),

  ScmAuth.createDefaultApiFactory(),
];
