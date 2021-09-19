import React, { createContext, useContext } from 'react'

import IServiceAdapter from './IServicesContextApdapter'

const ServicesContext = createContext<IServiceAdapter | null>(null)

export function useServices() {
  return useContext(ServicesContext) as IServiceAdapter
}

const ServicesProvider: React.FC<IServiceAdapter> = ({ children, ...services }) => {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
}

export default ServicesProvider
