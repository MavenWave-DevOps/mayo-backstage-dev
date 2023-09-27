import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const templatePrepopulatePlugin = createPlugin({
  id: 'template-prepopulate',
  routes: {
    root: rootRouteRef,
  },
});

export const TemplatePrepopulatePage = templatePrepopulatePlugin.provide(
  createRoutableExtension({
    name: 'TemplatePrepopulatePage',
    component: () =>
      import('./components/PrepopulateTemplateComponent').then(m => m.EditTemplateComponent),
    mountPoint: rootRouteRef,
  }),
);
