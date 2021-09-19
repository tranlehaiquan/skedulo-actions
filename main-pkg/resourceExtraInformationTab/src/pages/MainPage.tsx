import React from 'react'

import { MainLayout } from '../components/Layouts'
import { ExtraInformationForm } from '../features/ExtraInformationForm'

const MainPage = () => {
  return (
    <MainLayout>
      <div className="cx-w-1/4">
        <ExtraInformationForm />
      </div>
    </MainLayout>
  )
}

export default MainPage
