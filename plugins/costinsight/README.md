# backstage-plugin-costinsight

Welcome to the costinsight plugin!

## Installation

_This plugin was created through the Backstage CLI_ 

`yarn new backstage-cli`

### What is the costinsight?

This is an internal package used by [@backstage/core](https://www.npmjs.com/package/@backstage/core), [@backstage/cli](https://www.npmjs.com/package/@backstage/cli), and [@backstage/backend-common](https://www.npmjs.com/package/@backstage/backend-common) to leverage google bigquery data exposed by server side plugin `bigquery-api-backend`

## Getting started

This plugin has been added to the mayo-backstage plugins in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/cost-insights](http://localhost:3000/cost-insights).

Recommended to use `yarn dev` from terminal to fetch corresponding data which exposed by backend system(server side).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Documentation

- [Backstage Plugin Guide](https://backstage.io/docs/plugins/create-a-plugin/)
- [Backstage Documentation](https://backstage.io/docs)
