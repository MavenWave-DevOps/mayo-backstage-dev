import React, { useEffect, useState } from "react";
import { useEntity } from '@backstage/plugin-catalog-react';
import { convertSchema } from "../../hooks/utility";
import { CostapiFetchComponent } from "../CostapiFetchComponent";
import { costinsightObject } from "../../hooks/costinsightObject";

export const CostapiComponen = () => {

  // // const bgCostApi = useApi(costinsightApiRef);
  // const [responsedata, setResponseData] = useState<any>({});
  // // var projectId = []
  // let usage_amount: any = []
  // let service_description: any = []
  // var id: any = []
  // //const [allValue, setAllValue] = useState<any>({})
  // useEffect(() => {

  //   const fetchbgCostdata = async () => {
  //     try {

  //       const bgresponse = {}; //await bgCostApi.getResponseData();
  //       setResponseData({ bgresponse });
  //     }
  //     catch (error) {
  //       console.error('Error Fetching Bigquery API', error);
  //     }
  //   }; fetchbgCostdata();

  //   if (Object.keys(responsedata).length !== 0) {
  //     const filterData = convertSchema(responsedata["responseData"]["schema"]["fields"], responsedata["responseData"]["rows"]);
  //     for (var i = 0; i < 5; i++) {
  //       console.log('Filtered Data', Object.values(filterData[i]))
  //       for (let key in Object.keys(filterData[i])) {
  //         console.log(`Object key: '${Object.keys(filterData[i])[key]}' and Value: '${Object.values(filterData[i])[key]}'`)

  //         if (Object.keys(filterData[i])[key] === 'id') {
  //           id.push(Object.values(filterData[i])[key])
  //         }
  //         if (Object.keys(filterData[i])[key] === 'description') {
  //           service_description.push(Object.values(filterData[i])[key])
  //         }
  //         if (Object.keys(filterData[i])[key] === 'usage_amt') {
  //           console.log(Object.values(filterData[i])[key])
  //           usage_amount.push(Object.values(filterData[i])[key])
  //         }


  //       }
  //     }

  //     console.log("all values detail", usage_amount, service_description, id)
  //     // console.log('Filtered Data', filterData[0])
  //   }
  //   else {
  //     console.info('Response is Empty')
  //   }
  // }, []);

  // return (
  //   <div><h1>costapi plugin</h1>
  //     <CostapiFetchComponent />
  //   </div>
  // )


  const { entity } = useEntity();
  const { error, loading, status } = costinsightObject();
  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  return (<>
    <div>Hello {entity.metadata.name}</div>
    <div>Status: {status}</div>
  </>);

};

