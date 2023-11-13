import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

import fetch from 'node-fetch';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/config/:configId', (request, response) => {
    const { configId } = request.params;
    logger.info("biquery configuration");
    const readConfig = config.getOptionalString(`bigquery.${configId}`);
    response.send({ response: readConfig });
  });

  const readAppConfig = config.getConfig('bigqueryapi');
  const projectId = readAppConfig.getString('projectId');
  const gbdataset = readAppConfig.getString('gbdataSet');
  const { GoogleAuth, Impersonated } = require('google-auth-library');
  const appConfig = config.getConfig('backend')
  const apiUrl = appConfig.getString('apiUrl');

  async function getEntityInfo() {
    const response = await fetch(`${apiUrl}/api/catalog/entities?fields=spec.folderId`)
    if (!response.ok) {
      logger.info(`Something wrong with GCP folder-ID - ${response.status}`)
    }
    const json = await response.json();
    return json
  }

  router.get('/dataset', async (_, response) => {
    const entityInfo = await getEntityInfo()
    const folderId = JSON.stringify(entityInfo).split("spec")[1].split("},{}")[0].split('folderId":"')[1].split("}")[0].split('"')[0]
    const scopes = 'https://www.googleapis.com/auth/cloud-platform'
    const auth = new GoogleAuth({
      scopes: scopes
    });
    const client = await auth.getClient();
    let targetPrincipal = 'cost-insights-sa@infra-billing.iam.gserviceaccount.com'

    const targetClient = new Impersonated({
      sourceClient: client,
      targetPrincipal: targetPrincipal,
      lifetime: 30,
      delegates: [],
      targetScopes: [scopes]
    });
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`
    const res = await targetClient.request({
      url, method: 'POST', headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        "query":
          `SELECT distinct invoice.month AS invoice_month, service.description AS service_description, (SELECT key from UNNEST(project.labels) where value = 't1') as env, (SELECT resource_name from UNNEST(project.ancestors) where resource_name = '${folderId}') as folderID, SUM(cost) + SUM(IFNULL((SELECT SUM(c.amount) FROM UNNEST(credits) c), 0)) AS net_cost, (SUM(CAST(cost AS NUMERIC)) + SUM(IFNULL((SELECT SUM(CAST(c.amount AS NUMERIC)) FROM UNNEST(credits) AS c), 0))) AS usage_amount FROM ${projectId}.${gbdataset}.gcp_billing_export_v1_0105E1_61A6DE_D85D10 as bq, UNNEST(project.ancestors) as ancestor WHERE ancestor.resource_name = '${folderId}' AND TIMESTAMP_TRUNC(_PARTITIONTIME, DAY) = TIMESTAMP(current_date('UTC')) GROUP BY 1, 2, 3, 4 ORDER BY 1, 2, 3, 4`,
        "useLegacySql": false
      }),
    });
    response.json({ responseData: res.data })
  });

  router.use(errorHandler());
  return router;
}

