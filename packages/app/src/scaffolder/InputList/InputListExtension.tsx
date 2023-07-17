import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { Button,  Checkbox,  IconButton,  Input,  TextField,Typography } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder';
import { FieldProps, FieldValidation } from '@rjsf/core';
import { Textarea } from '@mui/joy';

/*
 This is the actual component that will get rendered in the form
*/

export const InputList = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldProps<string>) => {
  
  

  interface dataType {
    [key: string]: string;
  }
   
  const [inputFields,setInputFields]=useState<dataType[]>([{lifecycle:'',repo:'',label:''}]);
   

  const handleChangeInput=(index:number,event)=>{
  
    const values=[...inputFields]  ;         
    values[index][event?.target.name]=event?.target.value;
    setInputFields(values);
     console.log(inputFields);
     
  }


  const ConvertInputTOString=():string=>{

    const textarea=document.getElementById("textArea") as HTMLTextAreaElement;
    const checkbox=document.getElementById("myCheck") as HTMLInputElement;

   


    const projectDetailsArray=inputFields;
    let textAreaValue = '';
    for (let i=0;i< projectDetailsArray.length;i++)
    {
      textAreaValue +=`\n \n lifecycle : ${projectDetailsArray[i].lifecycle} \n repo : ${projectDetailsArray[i].repo} \n label : ${projectDetailsArray[i].label} `

    }


    if(checkbox.checked===true)
    {

       textarea.disabled=false;
       textarea.value=textAreaValue;
    }
    else
    {

      textarea.disabled=true;
      textarea.value="";

    }

    return textAreaValue;
     
  }


  const handleAddFields=()=>{
     setInputFields([...inputFields,{lifecycle:'',repo:'',label:''}])
     console.log(formData);
  }

  
  const handleRemovefields=(index:number)=>{
    console.log(index);
    if(index===0)
    {
      return;
    }

    const values=[...inputFields];
    values.splice(index,1);
    setInputFields(values);
 }


  return (
    
    <form >

           

          {inputFields.map((inputFields,index)=>(
           <div key={index}>
            <TextField  
              fullWidth 
              size='medium'
             name="lifecycle"
             label="lifecycle"
             variant='filled'
            //  value={inputFields.lifecycle}
            onChange={e =>handleChangeInput(index,e) }
            ></TextField>
            <br></br>
            <br></br>
            <TextField 
              fullWidth 
              size='medium'
             name="repo"
             label="repo"
             variant='filled'
            //  value={inputFields.repo}
            onChange={e =>handleChangeInput(index,e) }
            ></TextField>
             <br></br>
             <br></br>
            
            <TextField 
            fullWidth 
            size='medium'
             name="label"
             label="label"
             variant='filled'
           // value={inputFields.label}
           onChange={e =>handleChangeInput(index,e) }
            ></TextField>
            <br></br>
            <br></br>
               <IconButton onClick={()=>handleRemovefields(index)}>
                <RemoveIcon></RemoveIcon>
               </IconButton>

               <IconButton onClick={()=>handleAddFields()}>
                <AddIcon></AddIcon>
               </IconButton>

           </div>

          ))}

  <input type='checkbox'
       id="myCheck"
        aria-describedby="entityName"
        onChange={e => onChange(e.target.value=ConvertInputTOString())}
      /> Parse the Project detials  (kindly recheck the checkbox if you make changes above)
      <br></br>
 
     <textarea disabled id="textArea" cols="100" rows="10"></textarea>
         
</form>
  );
};

