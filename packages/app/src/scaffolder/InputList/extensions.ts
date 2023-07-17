import {
    scaffolderPlugin,
    createScaffolderFieldExtension,
  } from '@backstage/plugin-scaffolder';
  import {
    InputList,
   
  } from './InputListExtension';
  
  export const InputListExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
      name: 'InputListExtension',
      component: InputList,
    }),
  );