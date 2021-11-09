import AppServices from '../../services/appServices'

import IServiceAdapter from './IServicesContextApdapter'
import resourceAdapter from './resourceAdapter'

const makeServicesAdapter = (appServices: typeof AppServices) => (): IServiceAdapter => {
  return {
    getReferenceUIDFromContext: () => {
      return appServices.getReferenceUIDFromContext()
    },
    searchObject: (objectName: string, searchTerm: string, nameField?: string) => {
      return appServices.searchObject(objectName, searchTerm, nameField)
    },
    ...resourceAdapter(appServices),
  }
}

export default makeServicesAdapter
