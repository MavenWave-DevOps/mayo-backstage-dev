import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { templatePrepopulatePlugin, TemplatePrepopulatePage } from '../src/plugin';

createDevApp()
  .registerPlugin(templatePrepopulatePlugin)
  .addPage({
    element: <TemplatePrepopulatePage />,
    title: 'Root Page',
    path: '/template-prepopulate'
  })
  .render();
