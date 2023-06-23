import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { catalogConditions, createCatalogConditionalDecision, } from '@backstage/plugin-catalog-backend/alpha';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { Config, ConfigReader } from '@backstage/config';
import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';


// export interface ymlConfig {
//   ADMIN: string;
//   GROUP: string;
//   USER: string;
// }
// const getymlConfig = (config: Config): ymlConfig => {
//   return config.get<ymlConfig>('backend.env');
// }

// let rbac = getymlConfig(ConfigReader.fromConfigs());

// const backendConfig = {
//   backend: {
//     baseUrl: 'http://localhost:7007',
//   },
// };
// const Rconfig = new ConfigReader(backendConfig);
// console.log('$##########################33$', Rconfig.getConfig('backend'));

//Custome code start here
async function main() {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });
  const itemConfig = config.getConfig('rbac-plugin.teams');
  console.log('$$$$$$$$$$$$$$$$$$$$$$$4', itemConfig)
}
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
//End of the custom code

class AccessPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, catalogEntityReadPermission)) {
      if (user?.identity.ownershipEntityRefs.includes('group:default/ado-dev-team')) {
        return { result: AuthorizeResult.ALLOW }
      }

      if (user?.identity.ownershipEntityRefs.includes('group:default/businessb') || user?.identity.ownershipEntityRefs.includes('group:default/business_a')) {
        return { result: AuthorizeResult.ALLOW }
      }

      return createCatalogConditionalDecision(
        request.permission, {
        anyOf: [
          {
            allOf: [
              catalogConditions.isEntityKind({ kinds: ['template'] }),
              catalogConditions.isEntityOwner({
                claims: user?.identity.ownershipEntityRefs ?? ['Group'],
              }),
            ],
          },
        ],
      });
    }
    return { result: AuthorizeResult.ALLOW };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new AccessPolicy(),
    identity: env.identity,
  });
}
