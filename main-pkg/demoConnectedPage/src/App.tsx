import * as React from 'react'
import { ToastContainer } from 'react-toastify'

import { withGlobalLoading } from 'shared/dist/components/GlobalLoading'

import AppServices from './services/appServices'

import ServicesProvider from './contexts/services'
import makeServicesAdapter from './contexts/services/servicesAdapter'

import { MainPage } from './pages'

import 'react-toastify/dist/ReactToastify.css'

const servicesAdapter = makeServicesAdapter(AppServices)()

const App: React.FC = () => {
  return (
    <ServicesProvider {...servicesAdapter}>
      <MainPage />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        pauseOnHover={true}
        hideProgressBar={true}
        className="cx-z-9999"
      />
    </ServicesProvider>
  )
}

export default withGlobalLoading(App)
