// import React from 'react'

export const LoadAzureConfiguration = async (base:string) => {
    
    const url=base.concat('/api/prepopulatetemplate/azuretoken');
    const    tokenresponse= await fetch(url);
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
