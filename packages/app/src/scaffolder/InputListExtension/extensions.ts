import {
    scaffolderPlugin,
    createScaffolderFieldExtension,
} from "@backstage/plugin-scaffolder";
import {

}

export const InputListExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
        name: 'InputList',
        component: InputList,
    }
)