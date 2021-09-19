import AppServices from '../../services/appServices'

import IServiceAdapter from './IServicesContextApdapter'

const makeServicesAdapter = (appServices: typeof AppServices) => (): IServiceAdapter => ({
  getReferenceUIDFromContext: () => {
    return appServices.getReferenceUIDFromContext()
  },
  fetchResourceById: async (id: string) => {
    const res = await appServices.fetchResourceById(id)
    return {
      name: res.Name || '',
      phone: res.PrimaryPhone || res.MobilePhone || '',
      email: res.Email || '',
    }
  },
})

export default makeServicesAdapter
