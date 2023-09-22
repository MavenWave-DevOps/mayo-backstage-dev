import React from 'react';
import {  Grid, Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
  ContentHeader,
  SupportButton,
  InfoCard,
} from '@backstage/core-components';
import { PrepopulateTemplateComponent } from './PrepopulateTemplateComponent';


export const BaseComponent = () => (

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
