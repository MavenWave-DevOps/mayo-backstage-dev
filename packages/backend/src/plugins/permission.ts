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
import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';

class AccessPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, catalogEntityReadPermission)) {
      if (user?.identity.ownershipEntityRefs.includes('group:default/' + group)) {
        return { result: AuthorizeResult.ALLOW }
      }

      if (user?.identity.ownershipEntityRefs.includes('group:default/' + group) || user?.identity.ownershipEntityRefs.includes('group:default/' + group)) {
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
    return { result: AuthorizeResult.DENY };
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

/**
 * Read user group from config
 */
let group = '';
export async function main() {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });
  for (const itemKey of config.keys()) {
    if (itemKey == 'app' || itemKey == 'otherrole') {
      const itemConfig = config.getConfig('set-permission.role').getConfig(itemKey);
      group = itemConfig.getString('group') ?? [];
    }

  }
  return group;
}
main().catch(error => {
  console.error('Backend failed to start up, Please Define Role in Config', error);
  process.exit(1);
});
