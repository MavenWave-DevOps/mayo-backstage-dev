import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/hello', (_, response) => {
    logger.info("get sankd request")
    response.json({ status: 'OKKK' });
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


  router.get('/dataset', async (_, response) => {

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
        'Authorization': 'Bearer ${accessToken}',
      },
      body: JSON.stringify({
        "query":
          `SELECT invoice.month, service.description, project.id SUM(cost) + SUM(IFNULL((SELECT SUM(c.amount) FROM UNNEST(credits) c), 0)) AS total, (SUM(CAST(cost AS NUMERIC)) + SUM(IFNULL((SELECT SUM(CAST(c.amount AS NUMERIC)) FROM UNNEST(credits) AS c), 0))) AS usage_amt FROM ${projectId}.${gbdataset}.gcp_billing_export_v1_0105E1_61A6DE_D85D10 where project.id = 'mw-infra-shared-services' and TIMESTAMP_TRUNC(_PARTITIONTIME, DAY) = TIMESTAMP(current_date('UTC')) GROUP BY 1, 2, 3 ORDER BY 1 ASC, 2 ASC`,
        "useLegacySql": false
      }),
    });
    response.json({ responseData: res.data })
  });

  router.use(errorHandler());
  return router;
}
