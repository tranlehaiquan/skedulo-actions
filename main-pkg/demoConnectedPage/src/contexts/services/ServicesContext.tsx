import * as React from 'react'
import { createContext, useContext } from 'react'

import IServiceAdapter from './IServicesContextApdapter'

const ServicesContext = createContext<IServiceAdapter | null>(null)

export function useServices() {
  return useContext(ServicesContext) as IServiceAdapter
}

const ServicesProvider: React.FC<IServiceAdapter> = ({ children, ...servicesAdapter }) => {
  return <ServicesContext.Provider value={servicesAdapter}>{children}</ServicesContext.Provider>
}

export default ServicesProvider
