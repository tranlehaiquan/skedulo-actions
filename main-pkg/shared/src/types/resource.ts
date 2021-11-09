import { FetchResources, FetchResourceById } from '../__graphql/graphql'

type OmitTypeName<T> = Omit<T, '__typename'>

export type Resources = OmitTypeName<FetchResources.Node>
export type ResourceById = OmitTypeName<FetchResourceById.ResourcesById>