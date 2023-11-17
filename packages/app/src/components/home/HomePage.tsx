import {
  HeaderWorldClock,
  ClockConfig,
  HomePageStarredEntities,
  CustomHomepageGrid,
  HomePageToolkit,
  HomePageCompanyLogo,

} from '@backstage/plugin-home';

import { Content, Header, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { HomePageCalendar } from '@backstage/plugin-gcalendar';
import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { DocsIcon } from '@backstage/core-components';

const clockConfigs: ClockConfig[] = [
  {
    label: 'NYC',
    timeZone: 'America/New_York',
  },
  {
    label: 'UTC',
    timeZone: 'UTC',
  },
  {
    label: 'IST',
    timeZone: 'Asia/Kolkata',
  },
  {
    label: 'STO',
    timeZone: 'Europe/Stockholm',
  },
  {
    label: 'TYO',
    timeZone: 'Asia/Tokyo',
  },
];

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const defaultConfig = [
  {
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 12,
    height: 1,
  },
  {
    component: 'HomePageStarredEntities',
    x: 0,
    y: 2,
    width: 3,
    height: 5,
  },
  {

    component: 'HomePageToolkit',
    x: 0,
    y: 2,
    width: 3,
    height: 5,
  },
  {
    component: 'ComponentTab',
    x: 0,
    y: 2,
    width: 3,
    height: 5,

    title: "My tab",
    tabs: {
      lable: 'service-dashboard',
      Component: 'service',
    }
  },
];

export const homePage = (

  <Page themeId="home">
    <Header title={''} pageTitleOverride=" Welcome Back! ">
      <HeaderWorldClock
        clockConfigs={clockConfigs}
        customTimeFormat={timeFormat}
      />
    </Header>
    <Content>
      <CustomHomepageGrid config={defaultConfig}>

        <HomePageSearchBar />
        <HomePageCalendar />
        <HomePageStarredEntities />
        <HomePageCompanyLogo />
        <HomePageToolkit
          tools={[
            {
              url: 'https://mayo.edu',
              label: 'Mayo Homepage',
              icon: <HomeIcon />,
            },
            {
              url: 'https://www.mayo.edu/research/publications',
              label: 'Clinical Docs',
              icon: <DocsIcon />,
            },
          ]}
        />
      </CustomHomepageGrid>
    </Content>

  </Page>
);
