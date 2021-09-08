import { JobAllocations } from 'shared/dist/__graphql/graphql'

export interface HasId {
  UID: string
}

export interface GraphQlRequest {
  query: string
  variables?: {
    [key: string]: any
  }
}

export interface GraphQlResponse<T = any> {
  data: T
  errors?: object[]
}

export interface GraphQlMutationResponse {
  schema: {
    [key: string]: string
  }
}

export interface JobAllocationSubscription {
  data: {
    schemaJobAllocations: {
      data: JobAllocations
    }
  }
}

export enum OPERATION {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export const API_SERVER = 'https://api.skedulo.com'
