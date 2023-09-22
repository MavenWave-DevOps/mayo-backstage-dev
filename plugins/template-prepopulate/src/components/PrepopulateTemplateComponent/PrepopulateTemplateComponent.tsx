import React from 'react'
import { Grid,
  CardMedia
  ,Box
   ,Button,
   Card ,
   CardActions,
   CardContent,
   Typography, 
   LinearProgress} from '@mui/material'
import  LoadApiData from '../api/LoadApiData';
import { LoadAzureConfiguration } from '../api/LoadAzureConfiguration';

export const  handleClick =async (link:string) => { 
  const requestOptions= await LoadAzureConfiguration();

  console.log(link);
   const response= await fetch(link,requestOptions);
    const result = await response.text();
    console.log(result);
  const yaml = require('js-yaml');
    const doc = yaml.load(result,'utf8');
  const myJSON :string = JSON.stringify(doc.values);
  console.log(myJSON);
   const url:string=`http://localhost:3000/create/templates/default/${doc.name}?formData=${encodeURIComponent(myJSON)}`
   console.log(url);
  window.open(url);
   
  };


  
export const PrepopulateTemplateComponent = () => {

const response=  LoadApiData() ; 
const data:any =response.data;
console.log(data);

return (   
<div>
{response.err && <div className="dataloading">< h2 className="dataloadingh2">{response.err}</h2> </div>}
        {response.pending &&  <Box sx={{ width: '100%' , height:'20px' }}>    
      <LinearProgress />
    </Box>}
  <Grid container   spacing={3}>
    { data && data.map((data:any)=>
        <Grid   item key={data.relativePath} xs  ={6}  >   
          <Box  height={"220px"}  p={2}>  <Card >
            <CardMedia  component="img"  src="https://img.freepik.com/free-photo/abstract-grunge-decorative-relief-navy-blue-stucco-wall-texture-wide-angle-rough-colored-background_1258-28311.jpg?w=900&t=st=1695030006~exp=1695030606~hmac=e3f08f99202533292475360937396ad5ec4bb663554162b276c706d482d73222" height="70" >
          </CardMedia>
            <CardContent>
            <Typography variant='h5'>{data.relativePath}</Typography>
            </CardContent>
           <CardActions>
               <Button size='small'  onClick={()=>handleClick(data.url)}  >PrePopulate template</Button>
           </CardActions>
            </Card> </Box>
             </Grid>)
}
     </Grid>
          </div>

    )
}