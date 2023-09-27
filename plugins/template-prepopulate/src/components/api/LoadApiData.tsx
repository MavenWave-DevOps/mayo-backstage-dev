
import {
  useEffect,
  useState
} from "react";



const LoadApiData = (base:string) => {
  const [data, setdata] = useState(null);
  const [pending, setpending] = useState(true);
  const [err, seterr] = useState < string | null > (null);
  useEffect(() => {
      const fetchData = async () => {
          let newresult: any;
          const url = base+"/api/editTemplate/data"
          
          if (url !== undefined) {
              const newresponse = await fetch(url);
              try {
                  newresult = await newresponse.json();
                  if('err' in  newresult)
                  {
                    seterr("Failed to load data from server ");
                   setpending(false);
                 }else{
                  setdata(newresult);
                 }
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
