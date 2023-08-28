import { createApiFactory, createPlugin, createRoutableExtension, discoveryApiRef } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { costinsightApiRef } from './api';
import { bigqueryClient } from './api/bigqueryClient';

export const costinsightPlugin = createPlugin({
  id: 'bigqueryapi',
  apis: [
    createApiFactory({
      api: costinsightApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      },
      factory: ({ discoveryApi }) =>
        new bigqueryClient({ discoveryApi }),

    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const BgcostinsightPage = costinsightPlugin.provide(
  createRoutableExtension({
    name: 'BgcostinsightPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
