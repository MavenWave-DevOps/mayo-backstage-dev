/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import Router from 'express-promise-router';
import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  CacheManager,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import search from './plugins/search';
import kubernetes from './plugins/kubernetes';
import azureDevOps from './plugins/azure-devops';
import permission from './plugins/permission';
import { PluginEnvironment } from './types';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import explore from './plugins/explore';
import bigqueryapi from './plugins/bigqueryapi';
import prepopulatetemplate from './plugins/prepopulatetemplate';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);
  const databaseManager = DatabaseManager.fromConfig(config, { logger: root });
  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  const taskScheduler = TaskScheduler.fromConfig(config);

  const identity = DefaultIdentityClient.create({
    discovery,
  });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);
    return {
      logger,
      database,
      cache,
      config,
      reader,
      discovery,
      tokenManager,
      scheduler,
      permissions,
      identity,
    };
  };
}

async function main() {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
  const azureDevOpsEnv = useHotMemoize(module, () => createEnv('azure-devops'));
  const permissionEnv = useHotMemoize(module, () => createEnv('permission'));
  const exploreEnv = useHotMemoize(module, () => createEnv('explore'));
  const bigqueryapiPluginEnv = useHotMemoize(module, () => createEnv('bigqueryapi-plugin'))
  const prepopulatetemplateEnV = useHotMemoize(module, () => createEnv('prepopulatetemplate'))
  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv));
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/search', await search(searchEnv));
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
  apiRouter.use('/azure-devops', await azureDevOps(azureDevOpsEnv));
  apiRouter.use('/permission', await permission(permissionEnv));
  apiRouter.use('/explore', await explore(exploreEnv));
  apiRouter.use('/bigqueryapi', await bigqueryapi(bigqueryapiPluginEnv));
  apiRouter.use('/prepopulatetemplate',await prepopulatetemplate(prepopulatetemplateEnV))

  // Add backends ABOVE this line; this 404 handler is the catch-all fallback
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
