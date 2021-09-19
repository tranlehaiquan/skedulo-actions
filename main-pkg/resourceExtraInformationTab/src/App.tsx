import * as React from 'react'
import { ToastContainer } from 'react-toastify'

import { withGlobalLoading } from 'shared/dist/components/GlobalLoading'

import ServicesProvider, { AppServices } from './contexts/services'
import { MainPage } from './pages'

import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <ServicesProvider {...AppServices}>
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
