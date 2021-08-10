import * as React from 'react'

import { withGlobalLoading } from 'shared/dist/components/GlobalLoading'

import { routes } from './services/Services'

import RegionDetail from './pages/RegionDetail'

const App: React.FC = () => {
  const UID = routes?.[0] || '000634f8-2759-4f7c-ac8c-136685dccb78'

  if (!UID) {
    return null
  }

  return (
    <RegionDetail UID={UID} />
  )
}

export default withGlobalLoading(App)
