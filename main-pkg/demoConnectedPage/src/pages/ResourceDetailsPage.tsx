import React from 'react'

import { MainLayout } from '../components/Layouts'
import ResourceDetails from '../features/ResourceDetails/ResourceDetails'

const ResourceDetailsPage = () => {
  return (
    <MainLayout>
      <div className="cx-w-1/4">
        <ResourceDetails />
      </div>
    </MainLayout>
  )
}

export default ResourceDetailsPage
