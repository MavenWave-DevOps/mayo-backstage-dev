# 1. Overview

### This cost insight plugins built to consume multi cloud providers expense public api via doing REST Operation.

# 2. Approach

### To leverage this, we created two plugins one for client-side and another for server side, where server-side plugins interact with GCP cost Api via service account which executes the query in gcp bigquery and returns the response in the form of dataset.

### Client-side plugin is hooked up with server-side plugin to orchestrate response dataset in backstage entity dashboard

# 3. Techstack

### ● Node Js

### ● Express

### ● React

### ● REST

### ● GCP(service account & BigQuery)

### ● Chart library

# 4. Implementation

### In the following sections, we will break down the features in the two plugins.

# 4.1 Setup

## Step- 1

### ● Create backstage backend plugin (Plugin - Bigquery-api-backend)


### ● We followed the instructions provided by backstage Create a Backstage Plugins from cli.  Command to execute ‘yarn new backstage-cli` from terminal  and follow the on-screen  instructions.

### ● Create a Router file from this backend plugin for the REST operation which composed SQL queries, which invoked gcp bigquery api and returned the dataset in response( e.g- gcp resource name, expense amount and folderID ).

## Router.ts (business logic)
![router](https://github.com/MavenWave-DevOps/mayo-backstage-dev/assets/129176103/dbae5f49-cb16-4cca-8126-5285b31f14b5)

## Sample content of router.ts file


#### const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`

#### const res = await targetClient.request({

#### url, method: 'POST', headers: {

#### 'Content-type': 'application/json; charset=UTF-8',

#### },

#### body: JSON.stringify({

#### "query":

#### `SELECT XXXXXX

#### "useLegacySql": false

#### }),

#### });

### response.json({ responseData: res.data })


## Step 2-

### - Create backstage frontend plugin ( Plugin - costinsight ).
### - Run this command from terminal ‘ **yarn new backstage-cli`** and follow the instruction as shown on prompt

## Step 3-

###  - Create a util file which acts as an helper class to transform and mapped the backend plugin  response cost api data into valid json.

### Path - plugins/costinsight/src/hook/utility.js

#### function convertSchema(schema, rows) {

#### var resultRows = []

#### function recurse(schemaCur, rowsCur, colName) {

#### if (Array.isArray(schemaCur) && !Array.isArray(result[colName])) {

#### for (var i = 0, l = schemaCur.length; i < l; i++) {

#### if (colName === "")

#### recurse(schemaCur[i], rowsCur.f[i], colName + schemaCur[i].name)

#### else

#### recurse(schemaCur[i], rowsCur.f[i], colName + "." + schemaCur[i].name) } }


## Step 4-

### While we have associated the plugin’s UI as tabbed content within the Backstage Components UI, now we used another rest operation to get Entity which has gcp folder ID as parameter to  filter the gcp resource service cost data.

### path - Plugins//bigquery-api-backend/src/service/router.ts

#### async function getEntityInfo() {

#### const response = await fetch(`${apiUrl}/api/catalog/entities?fields=spec.folderId`)

#### if (!response.ok) {

#### logger.info(`Something wrong with GCP folder-ID - ${response.status}`)

#### }

#### const json = await response.json();

#### return json }

## Plugin- Costinsight

### - This UI plugin which is associated with the backend plugin. We followed the instruction  provided by backstage ‘integrate with software catalog’ documentations.

### - In this step we simply display our plugin UI as tabbed content on a Backstage service component, we then add the following lines into


### Path- packages/app/src/components/catalog/EntityPage.tsx

#### import { BgcostinsightPage } from 'backstage-plugin-costinsight';

#### <EntityLayout.Route path="/bgcostinsight" title="Cost-Insights">

#### <BgcostinsightPage />

#### </EntityLayout.Route> </EntityLayout>

## Step 5-

### - Create CostapiComponent js file to organize the cost layout page.

### Path - plugins/costinsight/src/components/CostapiComponent/CostapiComponent.js

## Step 6-

### Create Gcp service account and impersonate to secure access

#### - Create a service account in google cloud console with required admin credentials.




#### Note- Do not need to setup Keys as we would like to impersonate the service account and not perform The action as service account directly

#### - To update the permissions assigned to a service account , use IAM as shown below.
####  - Add Role to Service account

#####   1. Service account Token Creator

#####   2. Service usage Consumer

#####   3. Bigquery Admin

### E.g-


#### Now, service account created and assigned all the required permissions, time to use in backstage


##### - Install the google auth-library client from your project terminal by running the following  command- yarn add google-auth-library

#####  - Use service account in the file router.ts (backend-plugins), refer the code snippet below-

## Inject gcp folder id from entity

#### Add the gcp folder id into backstage software catalog entity file

#### (catalog-info.yaml)


### Read catalog-info.yaml entity file as REST api call.

#### Note- before reading the entity file, please do ensure the entity is responsive from the browser.

#### http://localhost:7007/api/catalog/entities?fields=apiVersion

### Update application configuration

#### Do the following configuration in app-config.yaml (Backstage catalog configuration file) to inject the  required parameters like gcp project ID and bigquery dataset name.



