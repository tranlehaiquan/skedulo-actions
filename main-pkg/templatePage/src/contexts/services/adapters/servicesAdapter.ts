import AppServices from '../../../services/appServices'

import IServiceAdapter from './IServicesContextApdapter'

const makeServicesAdapter = (appServices: typeof AppServices) => (): IServiceAdapter => {
  return {
    searchObject: appServices.searchObject,
    fetchVocabulary: appServices.fetchVocabulary,
    fetchFieldVocabularies: appServices.fetchFieldVocabularies,
  }
}

export default makeServicesAdapter
