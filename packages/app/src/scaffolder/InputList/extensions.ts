import {
    scaffolderPlugin,
    createScaffolderFieldExtension,
} from "@backstage/plugin-scaffolder";
import {
    InputList,
   InputListValidation
} from './InputListExtension';

export const InputListExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'InputList',
        component: InputList,
        validation: InputListValidation,
    }
));