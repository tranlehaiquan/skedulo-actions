import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'

import useSkedHistory from '../hooks/useSkedHistory'
import { MainLayout } from '../components/Layouts'
import ListResources from '../features/ListResources'
import ResourceDetails from '../features/ResourceDetails'
import * as routes from '../routes'

const ResourcesPage = () => {
  const history = useSkedHistory()

  return (
    <MainLayout>
      <Router history={history}>
        <Switch>
          <Route exact={true} path={routes.listResourcesPath()} component={ListResources} />
          <Route exact={true} path={routes.resourceDetailPath()} component={ResourceDetails} />
        </Switch>
      </Router>
    </MainLayout>
  )
}

export default ResourcesPage
