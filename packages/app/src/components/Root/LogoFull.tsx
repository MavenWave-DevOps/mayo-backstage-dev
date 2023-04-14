/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import { makeStyles } from '@material-ui/core';
// import MayoLogoFull from './full-logo.png'
import MayoLogoFull from './mayo-clinic-logo.png'
const useStyles = makeStyles({
  logo: {
    height: 'auto',
    width: '100%',
  },
})

const LogoFull = () => {
  const classes = useStyles()

  return (
    <img
      className={classes.logo}
      style={{ height: 'fill' }}
      src={MayoLogoFull}
    />
  )
}

export default LogoFull
