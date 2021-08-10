import axios from 'axios'

import { 
  Services, 
  credentials 
} from './Services'
import { BaseObject, Attachment, UserMetadata } from '../types'
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

  searchObject = async (object: string, name: string, nameField: string = 'Name'): Promise<BaseObject[]> => {
    const caseObjectName = camelCase(object)
    const { [caseObjectName]: result } = await this.services.graphQL.fetch<{ [key: string]: BaseObject[] }>({
      query: `query {
        ${caseObjectName}(filter: "${nameField} LIKE '%${name}%'", first: 5, orderBy: "${nameField}") {
          edges {
            node {
              UID
              Name: ${nameField}
            }
          }
        }
      }
      `
    })

    return result
  }

  findObjectById = async (object: string, id: string, nameField: string = 'Name'): Promise<BaseObject | undefined> => {
    const caseObjectName = camelCase(object)
    const { model: result } = await this.services.graphQL.fetch<{ [key: string]: BaseObject | undefined }>({
      query: `query {
        model: ${caseObjectName}ById(UID: "${id}") {
          UID
          Name: ${nameField}
        }
      }
      `
    })

    return result
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
}

export const shareServices = new ShareServices(Services)