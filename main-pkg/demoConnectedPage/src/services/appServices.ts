import { UpdateResources } from 'shared/dist/__graphql/graphql'

import { fetchResource, fetchResourceById, getMaxRequestedWorkingHoursPerWeek } from './resourceServices'
import { context, Services } from './Services'
import axiosInstance from './httpClient'
import updateResourceQuery from './graphql/updateResource.gql'
import { END_POINTS } from './constants'

interface IGraphQLRequest {
  query: string
  variables?: Record<string, any>
  queryName?: string
}

const skedServices = Services
const skedContext = context

export const fetchGraphQl = <T>(body: IGraphQLRequest): Promise<T> => {
  return skedServices.graphQL.fetch<T>({
    operationName: body.queryName,
    query: body.query,
    variables: body.variables,
  })
}

const pushOneOffNotification = async (resourceId: string, message: string) => {
  const res = await axiosInstance.post<{ protocol: 'sms' | 'push' }>(END_POINTS.NOTIFICATION_ONE_OFF, {
    resourceId,
    message,
    protocol: 'push',
  })

  return res.data
}

const getReferenceUIDFromContext = (): string | undefined => {
  return skedContext?.referenceUID
}

const updateResource = async (id: string, payload: Partial<UpdateResources>): Promise<any> => {
  const res = await fetchGraphQl({
    query: updateResourceQuery,
    variables: {
      inputUpdateResource: {
        UID: id,
        ...payload,
      },
    },
  })

  return res
}

export default {
  pushOneOffNotification,
  fetchResource,
  getReferenceUIDFromContext,
  fetchResourceById,
  updateResource,
  getMaxRequestedWorkingHoursPerWeek,
}
