import React, { PropsWithChildren } from 'react'
import { Link, makeStyles } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import MapIcon from '@material-ui/icons/MyLocation'
import LibraryBooks from '@material-ui/icons/LibraryBooks'
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline'
import LogoFull from './LogoFull'
import LogoIcon from './LogoIcon'
import { NavLink } from 'react-router-dom'
import { GraphiQLIcon } from '@backstage/plugin-graphiql'
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings'
import { SearchModal, SidebarSearchModal } from '@backstage/plugin-search'
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  SidebarExpandButton,
  useSidebarOpenState,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api'
import { MayoLogoFull } from './MayoLogoFull'
import { MayoLogoIcon } from './MayoLogoIcon'
import { BackstageTheme } from '@backstage/theme'
import CategoryIcon from '@material-ui/icons/Category';
import LayersIcon from '@material-ui/icons/Layers';
import { useApp } from '@backstage/core-plugin-api';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';

const useSidebarLogoStyles = makeStyles<BackstageTheme, { themeId: string }>({
  root: {
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
    padding: '15px',
  },
})

const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState()
  const appThemeApi = useApi(appThemeApiRef)
  const themeId = appThemeApi.getActiveThemeId()
  const classes = useSidebarLogoStyles({ themeId: themeId! })
  const width = makeStyles<BackstageTheme, { themeId: string }>(() => ({
    root: {
      width: isOpen
        ? sidebarConfig.drawerWidthOpen
        : sidebarConfig.drawerWidthClosed,
    },
  }))({ themeId: themeId! })

  const fullLogo = themeId === 'mayo' ? <MayoLogoFull /> : <LogoFull />
  const iconLogo = themeId === 'mayo' ? <MayoLogoIcon /> : <LogoIcon />

  return (
    <div className={`${classes.root} ${width.root}`}>
      <Link
        component={NavLink}
        to='/'
        underline='none'
        className={`${classes.link} ${classes.width}`}
        aria-label='Home'
      >
        {isOpen ? fullLogo : iconLogo}
      </Link>
    </div>
  )
}

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />

      <SidebarGroup label='Search' icon={<SearchIcon />} to='/search'>
        <SidebarSearchModal>
          {({ toggleModal }) => <SearchModal toggleModal={toggleModal} />}
        </SidebarSearchModal>

      </SidebarGroup>
      <SidebarDivider />

      <SidebarGroup label='Menu' icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to='/' text='Home'>
          <SidebarSubmenu title="catalog">
            <SidebarSubmenuItem
              title="Domains"
              to="catalog?filters[kind]=domain"
              icon={useApp().getSystemIcon('kind:domain')}
            />
            <SidebarSubmenuItem
              title="Systems"
              to="catalog?filters[kind]=system"
              icon={useApp().getSystemIcon('kind:system')}
            />
            <SidebarSubmenuItem
              title="Components"
              to="catalog?filters[kind]=component"
              icon={useApp().getSystemIcon('kind:component')}
            />
            <SidebarSubmenuItem
              title="APIs"
              to="catalog?filters[kind]=api"
              icon={useApp().getSystemIcon('kind:api')}
            />

            <SidebarDivider />
            <SidebarSubmenuItem
              title="Resources"
              to="catalog?filters[kind]=resource"
              icon={useApp().getSystemIcon('kind:resource')}
            />
            <SidebarDivider />

            <SidebarSubmenuItem
              title="Groups"
              to="catalog?filters[kind]=group"
              icon={useApp().getSystemIcon('kind:group')}
            />
            <SidebarSubmenuItem
              title="Users"
              to="catalog?filters[kind]=user"
              icon={useApp().getSystemIcon('kind:user')}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <MyGroupsSidebarItem
          singularTitle="My Squad"
          pluralTitle="My Squads"
          icon={useApp().getSystemIcon('group')!}
        />
        <SidebarItem
          icon={useApp().getSystemIcon('kind:api')!}
          to="api-docs"
          text="APIs"
        />
        <SidebarItem icon={CategoryIcon} to="catalog" text="catalog" />
        <SidebarItem icon={LayersIcon} to="explore" text="Explore" />
        <SidebarItem icon={LibraryBooks} to='docs' text='Docs' />
        <SidebarItem icon={CreateComponentIcon} to='create' text='Create...' />
        <SidebarDivider />
        <SidebarScrollWrapper>
          <SidebarItem icon={MapIcon} to='tech-radar' text='Tech Radar' />
        </SidebarScrollWrapper>
        <SidebarDivider />
      </SidebarGroup>
      <SidebarItem icon={GraphiQLIcon} to="graphiql" text="GraphiQL" />
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label='Settings'
        icon={<UserSettingsSignInAvatar />}
        to='/settings'
      >
        <SidebarExpandButton />
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
)
