import * as React from 'react'
import { ToastContainer } from 'react-toastify'

import { withGlobalLoading } from 'shared/dist/components/GlobalLoading'

import { SWRConfig } from 'swr'

import AppServices from './services/appServices'

import ServicesProvider from './contexts/services'
import makeServicesAdapter from './contexts/services/adapters/servicesAdapter'

import MainPage from './pages/index'

import 'react-toastify/dist/ReactToastify.css'
import { fetchStatusMiddleware } from './hooks/useSWR'

const servicesAdapter = makeServicesAdapter(AppServices)()

const App: React.FC = () => {
  return (
    <ServicesProvider {...servicesAdapter}>
      <SWRConfig
        value={{
          use: [fetchStatusMiddleware],
        }}
      >
        <MainPage />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          pauseOnHover={true}
          hideProgressBar={true}
          className="cx-z-9999"
        />
      </SWRConfig>
    </ServicesProvider>
  )
}

export default withGlobalLoading(App)
