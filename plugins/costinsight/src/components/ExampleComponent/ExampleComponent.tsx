import {
  Header,
  Page,
  HeaderLabel,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import { useApi } from "@backstage/core-plugin-api";
import { costinsightApiRef } from "../../api";
import { convertSchema } from "../../hooks/utility";
import { CostGraph } from '../ExampleFetchComponent/CostGraph';


export const ExampleComponent = () => {

  const bgCostApi = useApi(costinsightApiRef);
  let [responsedata, setResponseData] = useState<any>({});


  useEffect(() => {

    const fetchbgCostdata = async () => {
      try {

        const bgresponse = await bgCostApi.getResponseData();
        setResponseData(bgresponse);
      }
      catch (error) {
        console.error('Error Fetching Bigquery API', error);
      }
    }; fetchbgCostdata();
  }, []);


  if (Object.keys(responsedata).length !== 0) {
    convertSchema(responsedata["responseData"]["schema"]["fields"], responsedata["responseData"]["rows"]);
  }
  else {
    console.info('Response is Empty')
  }

  return (
    <div>
      {responsedata ? (
        <Page themeId="tool">
          <Header title="MCCP" subtitle="2023-2024" >
            <HeaderLabel label="Environment" value="Google Cloud Resources" />
          </Header>
          <Grid container spacing={3}></Grid>
          <CostGraph />
        </Page>
      ) : (
        <p> Something goes wrong...</p>
      )}
    </div>
  );

};

