import React from 'react';
import {  Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { PrepopulateTemplateComponent } from './PrepopulateTemplateComponent';


export const EditTemplateComponent = () => (

    <Page themeId="tool">
      <Header title="Pre-Populate Templates" subtitle="Pre-populate the templates with standard values ">

      </Header>
      <Content>
        <ContentHeader title="Available Templates">

        </ContentHeader>
        <Grid container spacing={3} direction="column">
                    <Grid item>
            <PrepopulateTemplateComponent/>
          </Grid>
        </Grid>
      </Content>
    </Page>
);
