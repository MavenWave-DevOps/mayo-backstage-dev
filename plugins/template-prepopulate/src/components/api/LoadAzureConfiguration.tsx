// import React from 'react'

export const LoadAzureConfiguration = async () => {
    
  
    const    tokenresponse= await fetch('http://localhost:7007/api/prepopulatetemplate/azuretoken');
    const   responsejson = await tokenresponse.json();
    
    const specialcharacter=':';
    const azuretoken= specialcharacter.concat(responsejson?.Azuretoken);
    const Basic:string='Basic '
    const  Authorization=Basic.concat((btoa(azuretoken)));
     console.log(Authorization);

        const myHeaders = new Headers();
        myHeaders.append("Authorization",Authorization);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

      return requestOptions;  

}
