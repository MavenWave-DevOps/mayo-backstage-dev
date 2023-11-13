import React from 'react';
import {
  Route
} from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderFieldExtensions, ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
} from '@backstage/plugin-catalog-graph';
import { orgPlugin } from '@backstage/plugin-org';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';

import { GraphiQLPage } from '@backstage/plugin-graphiql';
import { darkTheme, lightTheme } from '@backstage/theme';
import { mayoTheme } from './themes/mayo';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { createApp } from '@backstage/app-defaults';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { EntityMyPluginContent } from '@internal/plugin-my-plugin';

import { AlertDisplay, OAuthRequestDialog, SignInPage } from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { providers } from './components/signin/identityProviders';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { homePage } from './components/home/HomePage';
import { ExplorePage } from '@backstage/plugin-explore';
import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { InputListExtension } from './scaffolder/InputList';

const app = createApp({
  apis,
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', ...providers]}

          align="center"
        />

      );
    },
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
    bind(catalogGraphPlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
  },
  themes: [
    {
      id: 'light',
      title: 'Light',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={lightTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      Provider: ({ children }) => (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'mayo',
      title: 'Mayo',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={mayoTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
  ],
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Route path="/" element={<HomepageCompositionRoot />}>
      {homePage}
    </Route>
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>

    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/graphiql" element={<GraphiQLPage />} />
    <Route path="/my-plugin" element={<EntityMyPluginContent />} />

    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <InputListExtension />
      </ScaffolderFieldExtensions>
    </Route>
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />

    <Route path="/catalog-graph" element={<CatalogGraphPage
      initialState={{
        selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
        selectedRelations: [
          RELATION_OWNER_OF,
          RELATION_OWNED_BY,
          RELATION_CONSUMES_API,
          RELATION_API_CONSUMED_BY,
          RELATION_PROVIDES_API,
          RELATION_API_PROVIDED_BY,
          RELATION_HAS_PART,
          RELATION_PART_OF,
          RELATION_DEPENDS_ON,
          RELATION_DEPENDENCY_OF,

        ],
      }}

    />} />

    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/my-plugin" element={<EntityMyPluginContent />} />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <div className='loginContainer'>
      <AlertDisplay />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </div>
  </AppProvider>
);


export default App;
