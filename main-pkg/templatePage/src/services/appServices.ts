import { shareServices } from 'shared'

import { GraphQLRequest } from './Services'

export const fetchGraphQL = async <T>(body: GraphQLRequest): Promise<T> => {
  const res = await shareServices.fetchGraphQl<T>(body)
  return res
}

const pushOneOffNotification = (resourceId: string, message: string) => {
  return shareServices.pushOnOffNotification(resourceId, message)
}

const searchObject = (objectName: string, searchTerm: string, nameField?: string) => {
  return shareServices.searchObject(objectName, searchTerm, nameField)
}

const fetchVocabulary = (objectNames?: string[]) => {
  return shareServices.fetchVocabulary(objectNames)
}

const fetchFieldVocabularies = (objectName: string, fieldName: string) => {
  return shareServices.fetchFieldVocabularies(objectName, fieldName)
}

export default {
  pushOneOffNotification,
  searchObject,
  fetchVocabulary,
  fetchFieldVocabularies,
}
