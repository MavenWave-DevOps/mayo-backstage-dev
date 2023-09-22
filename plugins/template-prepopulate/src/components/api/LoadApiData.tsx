
import {
  useEffect,
  useState
} from "react";

import { LoadAzureConfiguration } from "./LoadAzureConfiguration";

const LoadApiData = (base:string) => {
  const [data, setdata] = useState(null);
  const [pending, setpending] = useState(true);
  const [err, seterr] = useState < string | null > (null);
  useEffect(() => {
      const fetchData = async () => {
           console.log(base);
           const requestOptions= await LoadAzureConfiguration(base);

          let result: any;
          let newresult: any;
          const response = await fetch('https://dev.azure.com/foster-devops/mayo-backstage/_apis/git/repositories/MW-462/items?includeLinks=true&api-version=7.1-preview.1', requestOptions)
          try {
              result = await response.json();
          } catch (err) {
               
              seterr("Failed to load data from server token might be expired");
              setpending(false);
              
          }
          const url = result?.value[0]?._links?.tree?.href;
          console.log(url);
          if (url !== undefined) {
             
              const newresponse = await fetch(url, requestOptions);
              try {
                  newresult = await newresponse.json();
                  setdata(newresult?.treeEntries);
                  setpending(false);
              } catch (err) {
                  seterr("Failed to load data from server ");
                  setpending(false);
                 
              }
          }
      }
      fetchData();
  }, [])
  return {data,
      pending,
      err
  };
}
export default LoadApiData;
