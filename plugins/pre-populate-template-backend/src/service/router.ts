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
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const router = Router();

  router.use(express.json());

  router.get('/azuretoken', async(_, response) => {
    logger.info('Azure-token');
    const Azuretoken  = config.getOptionalString(`azureDevOps.token`);
    response.send({ Azuretoken: Azuretoken });
  });

  const axios = require('axios');
  router.get('/data', (_, response) => {
    logger.info('data');
    
    const Azuretoken  = config.getOptionalString(`azureDevOps.token`) as string;
    const specialcharacter=':';
    const azuretoken= specialcharacter.concat(Azuretoken);
    const Basic:string='Basic '
    const  Authorization=Basic.concat((btoa(azuretoken)));
     console.log(Authorization);
      
    
        

        response.send();
  });


  


  router.use(errorHandler());
  return router;
}
