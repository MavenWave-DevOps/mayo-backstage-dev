// import React from 'react';
// import { Typography, Grid } from '@material-ui/core';
// import {
//   InfoCard,
//   Header,
//   Page,
//   Content,
//   ContentHeader,
//   HeaderLabel,
//   SupportButton,
// } from '@backstage/core-components';
// // import { ExampleFetchComponent } from '../ExampleFetchComponent';

// export const ExampleComponent = () => (
//   <Page themeId="tool">
//     <Header title="Welcome to costinsight!" subtitle="Optional subtitle">
//       <HeaderLabel label="Owner" value="Team X" />
//       <HeaderLabel label="Lifecycle" value="Alpha" />
//     </Header>
//     <Content>
//       <ContentHeader title="Plugin title">
//         <SupportButton>A description of your plugin goes here.</SupportButton>
//       </ContentHeader>
//       <Grid container spacing={3} direction="column">
//         <Grid item>
//           <InfoCard title="Information card">
//             <Typography variant="body1">
//               All content should be wrapped in a card like this.
//             </Typography>
//           </InfoCard>
//         </Grid>
//         <Grid item>
//           {/* <ExampleFetchComponent /> */}
//         </Grid>
//       </Grid>
//     </Content>
//   </Page>
// );


// import React from 'react';
// import { useEntity } from '@backstage/plugin-catalog-react';
// import { costinsightObject } from '../../hooks/costinsightObject';
// // import { ExampleFetchComponent } from '../ExampleFetchComponent';

// export const ExampleComponent = () => {
//   const { entity } = useEntity();
//   const { error, loading, status } = costinsightObject();
//   if (loading) {
//     return <div>Loading</div>;
//   }
//   if (error) {
//     return <div>Error</div>;
//   }
//   return (<>
//     <div>Hello {entity.metadata.name}</div>
//     <div>Status: {status}</div>
//     {/* <ExampleFetchComponent /> */}
//   </>);
// }

import React, { useEffect, useState } from "react";

import { useApi } from "@backstage/core-plugin-api";

import { costinsightApiRef } from "../../api";
import { convertSchema } from "../../hooks/utility";

export const ExampleComponent = () => {

  const bgCostApi = useApi(costinsightApiRef);
  const [status, setStatus] = useState<string>('');
  const [responsedata, setResponseData] = useState<any>({});

  useEffect(() => {
    const fetchbgCostdata = async () => {
      try {
        const data = await bgCostApi.getHealth();
        const bgresponse = await bgCostApi.getResponseData();

        setResponseData(bgresponse);

        setStatus(data.status);
      }
      catch (error) {
        console.error('ERROR FETCHING BIGQUERY API', error);
      }

    };

    fetchbgCostdata();

  }, []);

  // const sschema = responsedata['responseData']['schema'];
  // // var ssrows = responsedata['responseData'];
  // console.log('Experimental Schema', sschema);
  // // console.log('Experimental Rows', ssrows);
  console.log('RESPONSE-DATA', responsedata);
  const rrows = convertSchema(responsedata["responseData"]["schema"]["fields"], responsedata["responseData"]["rows"]);
  console.log('CONVERTED', rrows);

  return (

    <div>
      {responsedata ? (
        <div>
          <h1>BG BACKEND DATASET PLUGIN API</h1>
          <p>sankd: {responsedata.length

          }</p>
        </div>

      ) : (<p>status: health</p>)}
    </div>
  );
};

