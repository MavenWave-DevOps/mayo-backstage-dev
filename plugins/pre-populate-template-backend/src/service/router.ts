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
  const { config } = options;
  const router = Router();

  router.use(express.json());
  
  const fetch = require('node-fetch');
  const Authorization = 'Basic '.concat((btoa(':'.concat(config.getOptionalString(`azureDevOps.token`) as string))));
  
  router.post('/downloadyaml', async (request, response) => {
    const yamlurl = request.body.url;
    
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        'Authorization': Authorization,
      }
    }
    let data: any;
    const response2 = await fetch(yamlurl, requestOptions);
    try {
      data = await response2.text();
    } catch (err) {
      response.send({ err: 'Failed to load data from server ' });
    }

    response.send(data);
  });



  router.get('/data', async (_, response) => {
  
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        'Authorization': Authorization,
      }
    }
    let result: any;
    const organisation=config.getOptionalString(`azureDevOps.organization`) as string;
    const project=config.getOptionalString(`azureDevOps.project`) as string;
    const repo=config.getOptionalString(`azureDevOps.repo`) as string;
    const response2 = await fetch('https://dev.azure.com/'.concat(organisation).concat('/').concat(project).concat('/_apis/git/repositories/').concat(repo).concat('/items?includeLinks=true&api-version=7.1-preview.1'), requestOptions);

    try {
      result = await response2.json();
    } catch (err) {

      response.send({ err: 'Failed to load data from server ' });
    }

    const url = result?.value[0]?._links?.tree?.href;
    let newresult: any;
    let data;
    if (url !== undefined) {

      const newresponse = await fetch(url, requestOptions);
      try {
        newresult = await newresponse.json();
        data = newresult?.treeEntries;
      } catch (err) {
        response.send({ err: 'Failed to load data from server ' });

      }
    }
    response.send(data);

  });


  router.use(errorHandler());
  return router;
}
