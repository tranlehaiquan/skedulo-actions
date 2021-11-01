import omit from 'lodash/omit'
import { Type } from 'shared'

import AppServices from '../../services/appServices'

import { ResourceAdapter } from './IServicesContextApdapter'

const resourceAdapter = (appServices: typeof AppServices): ResourceAdapter => ({
  fetchResourceById: async (id: string) => {
    // depending on the response from service, we will decide to format or not
    const res = await appServices.fetchResourceById(id)
    return res
  },
  fetchResources: async (variables: Type.GraphqlVariables) => {
    const res = await appServices.fetchResource(omit(variables, 'rawParams'))
    return res
  },
})

export default resourceAdapter
