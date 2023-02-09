import axios from 'axios'

import { 
  Services, 
  credentials 
} from './Services'
import { BaseObject, Attachment, UserMetadata, VocabularyField, Vocabulary, AutocompleteResult, PlaceDetail } from '../types'
import { camelCase } from 'lodash/fp'

export class ShareServices {
  constructor (private readonly services: Services) {}

  httpApi = axios.create({
    baseURL: credentials.apiServer,
    headers: {
      Authorization: `Bearer ${credentials.apiAccessToken}`
    }
  })

  fetchGraphQl = async <T>(body: object): Promise<T> => {
    const res = await this.httpApi.post(
      '/graphql/graphql',
      body
    )
    return res?.data?.data as T
  }

  searchObject = async (object: string, searchTerm: string, fieldName: string = 'Name', limit: number = 5): Promise<BaseObject[]> => {
    const caseObjectName = camelCase(object)
    const { [caseObjectName]: result } = await this.services.graphQL.fetch<{ [key: string]: BaseObject[] }>({
      query: `query {
        ${caseObjectName}(filter: "${fieldName} LIKE '%${searchTerm}%'", first: ${limit}, orderBy: "${fieldName}") {
          edges {
            node {
              UID
              Name: ${fieldName}
            }
          }
        }
      }
      `
    })

    return result
  }

  findObjectById = async (object: string, id: string, fieldName: string = 'Name'): Promise<BaseObject | undefined> => {
    const caseObjectName = camelCase(object)
    const { model: result } = await this.services.graphQL.fetch<{ [key: string]: BaseObject | undefined }>({
      query: `query {
        model: ${caseObjectName}ById(UID: "${id}") {
          UID
          Name: ${fieldName}
        }
      }
      `
    })

    return result
  }

  fetchFieldVocabularies = async (objectName: string, fieldName: string, convertToBaseObject?: boolean) =>{
    const resp = await this.services.metadata.fetchVocabularyField(objectName, fieldName)
    const activeItems = resp.filter(item => !!item.active)

    if (convertToBaseObject) {
      return activeItems.map(item => ({ UID: item.value, Name: item.label }) as BaseObject)
    }

    return activeItems as VocabularyField[]
  }

  fetchVocabulary = async (objectNames?: string[]) =>{
    const queryString = objectNames?.length ? `?names=${objectNames.join(',')}` : ''
    const resp = await this.httpApi.get(`/custom/vocabularies${queryString}`)

    return resp.data.result as Vocabulary
  }

  fetchAttachments = async (UID: string) =>{
    const {data: {result}} = await this.httpApi.get<{result: Attachment[]}>(`/files/attachments/${UID}`)
    return result
  }

  fetchUserMetadata = async (): Promise<UserMetadata | null> => {
    const res = await this.httpApi.get<{ result: UserMetadata }>('/auth/metadata/user')
    return res.data.result
  }
  
  pushOnOffNotification = async (resourceId: string, message: string, protocol?: 'push' | 'sms'): Promise<boolean> => {
    const res = await this.httpApi.post('/notifications/oneoff', {
      resourceId,
      message,
      protocol
    })
  
    return !!res
  }

  fetchAddressAutocomplete = async (input: string, sessionId: string, country?: string) => {
    const res = await this.httpApi.post<{ result: AutocompleteResult }>('/geoservices/autocomplete', {
      input,
      sessionId,
      country
    })

    return res.data.result.predictions
  }

  fetchPlaceDetail = async (placeId: string, sessionId: string) => {
    const res = await this.httpApi.post('/geoservices/place', {
      placeId,
      sessionId
    })

    return res.data.result as PlaceDetail
  }

  fetchAddressGeocode = async (address: string | string[]) => {
    const res = await this.httpApi.post('/geoservices/geocode', {
      addresses: Array.isArray(address) ? address : [address]
    })
    const result = res.data.result

    return {
      address: result.GeocodeSuccess?.address,
      lat: result.GeocodeSuccess?.latlng.lat,
      lng: result.GeocodeSuccess?.latlng.lng
    }
  }
}

export const shareServices = new ShareServices(Services)