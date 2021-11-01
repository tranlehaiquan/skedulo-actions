import { Type } from 'shared'

export interface ServiceAdapter {
  getReferenceUIDFromContext: () => string | undefined
  searchObject: (objectName: string, searchTerm: string, nameField?: string) => Promise<Type.BaseObject[]>
}

export interface ResourceAdapter {
  fetchResources: (variables: Type.GraphqlVariables) => Promise<Type.TransformedListResponse<Type.Resources>>
  fetchResourceById: (id: string) => Promise<Type.ResourceById>
}

type IServiceAdapter = ServiceAdapter & ResourceAdapter

export default IServiceAdapter
