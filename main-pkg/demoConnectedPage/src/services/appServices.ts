import { shareServices } from 'shared'

import { context, Services } from './Services'
import axiosInstance from './httpClient'
import * as resourceServices from './resourceServices'

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

const searchObject = (objectName: string, searchTerm: string, nameField?: string) => {
  return shareServices.searchObject(objectName, searchTerm, nameField)
}

export default {
  pushOneOffNotification,
  getReferenceUIDFromContext,
  searchObject,
  ...resourceServices,
}
