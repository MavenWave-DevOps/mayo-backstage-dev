import React, { useEffect, useState } from "react";
import { convertSchema } from "../../hooks/utility";

export const ExampleComponent = () => {

  // const bgCostApi = useApi(costinsightApiRef);
  const [responsedata, setResponseData] = useState<any>({});
  // var projectId = []
  let usage_amount: any = []
  let service_description: any = []
  var id: any = []
  //const [allValue, setAllValue] = useState<any>({})
  useEffect(() => {

    const fetchbgCostdata = async () => {
      try {

        const bgresponse = {}; //await bgCostApi.getResponseData();
        setResponseData({ ...bgresponse });
      }
      catch (error) {
        console.error('Error Fetching Bigquery API', error);
      }
    }; fetchbgCostdata();

    if (Object.keys(responsedata).length !== 0) {
      const filterData = convertSchema(responsedata["responseData"]["schema"]["fields"], responsedata["responseData"]["rows"]);
      for (var i = 0; i < 5; i++) {
        console.log('Filtered Data', Object.values(filterData[i]))
        for (let key in Object.keys(filterData[i])) {
          console.log(`Object key: '${Object.keys(filterData[i])[key]}' and Value: '${Object.values(filterData[i])[key]}'`)

          if (Object.keys(filterData[i])[key] === 'id') {
            id.push(Object.values(filterData[i])[key])
          }
          if (Object.keys(filterData[i])[key] === 'description') {
            service_description.push(Object.values(filterData[i])[key])
          }
          if (Object.keys(filterData[i])[key] === 'usage_amt') {
            console.log(Object.values(filterData[i])[key])
            usage_amount.push(Object.values(filterData[i])[key])
          }


        }
      }

      console.log("all values detail", usage_amount, service_description, id)
      // console.log('Filtered Data', filterData[0])
    }
    else {
      console.info('Response is Empty')
    }
  }, []);

  return (
    <div></div>
  )

};

