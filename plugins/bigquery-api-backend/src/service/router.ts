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
  // var responseData = []

  router.get('/dataset', async (_, response) => {

    const { JWT } = require('google-auth-library');
    const keys = require('../config/cedar-setup.json');
    const client = new JWT({
      email: keys.client_email,
      key: keys.private_key,
      scopes: ['https://www.googleapis.com/auth/bigquery'],
    });
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`
    const res = await client.request({
      url, method: 'POST', headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${accessToken}'
      },
      body: JSON.stringify({
        "query":
          `SELECT distinct billing.project.id,price.service.description,price.billing_account_price.tiered_rates[SAFE_OFFSET(0) ].start_usage_amount AS usage_amt FROM ${projectId}.costtrend.cloud_pricing_export price, ${projectId}.costtrend.gcp_billing_export_v1_018341_C12D96_C76360 billing WHERE price.billing_account_price.tiered_rates[SAFE_OFFSET(0) ].start_usage_amount is not null AND TIMESTAMP_TRUNC(billing._PARTITIONTIME, DAY) = TIMESTAMP(current_date('UTC')) ORDER BY usage_amt DESC LIMIT 5`
        , "useLegacySql": false
      }),
    });
    response.json({ responseData: res.data })
  });

  router.use(errorHandler());
  return router;
}
