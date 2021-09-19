import { Resources } from 'shared/dist/__graphql/graphql'

import AppServices from '../../services/appServices'

import IServiceAdapter from './IServicesContextApdapter'

const makeServicesAdapter = (appServices: typeof AppServices): IServiceAdapter => ({
  fetchResources: (filter?: string) => {
    return appServices.fetchResource(filter)
  },
  getReferenceUIDFromContext: () => {
    return appServices.getReferenceUIDFromContext()
  },
  fetchResourceById: (id: string) => {
    return appServices.fetchResourceById(id)
  },
  getMaxRequestedWorkingHoursPerWeek: (resourceId: string) => {
    return appServices.getMaxRequestedWorkingHoursPerWeek(resourceId)
  },
  updateResource: (id: string, payload: Partial<Resources>) => {
    return appServices.updateResource(id, payload)
  },
})

const servicesAdapter = makeServicesAdapter(AppServices)

export default servicesAdapter
