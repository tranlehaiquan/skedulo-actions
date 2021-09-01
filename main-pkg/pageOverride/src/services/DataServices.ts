import axios from 'axios'

import { Regions, Resources, UpdateRegions, NewResourceTags } from 'shared/dist/__graphql/graphql'
import { generateSingleMutation } from 'shared/dist/utils/graphql'
import { shareServices } from 'shared/dist/services/ShareServices'
import { TransformedListResponse } from 'shared/dist/types'

import fetchRegionByIdQuery from '../queries/fetchRegionById.gql'
import fetchResourcesQuery from '../queries/fetchResources.gql'

import { Services, GraphQLMutationResult, credentials } from './Services'

export const searchObject = shareServices.searchObject

export class DataServices {
  constructor(private readonly services: Services) {}

  httpApi = axios.create({
    baseURL: credentials.apiServer,
    headers: {
      Authorization: `Bearer ${credentials.apiAccessToken}`,
    },
  })

  fetchGraphQl = async <T>(body: object): Promise<T> => {
    const res = await this.httpApi.post('https://api.skedulo.com/graphql/graphql', body)

    return res?.data?.data as T
  }

  fetchRegionById = async (regionId: string): Promise<Regions> => {
    const { regionsById } = await this.services.graphQL.fetch<{
      regionsById: Regions
    }>({
      query: fetchRegionByIdQuery,
      variables: {
        id: regionId,
      },
    })

    return regionsById
  }

  fetchResources = async (filter: string): Promise<TransformedListResponse<Resources>> => {
    const { resources } = await this.fetchGraphQl({
      query: fetchResourcesQuery,
      variables: {
        filter,
        orderBy: 'CreatedDate DESC',
        first: 200,
        offset: 0,
      },
    })

    return {
      data: resources.edges.map(({ node }: { node: Resources }) => node),
      hasNextPage: resources.pageInfo.hasNextPage,
      totalCount: resources.totalCount,
    }
  }

  updateRegion = async (updateInput: UpdateRegions): Promise<GraphQLMutationResult> => {
    return await this.services.graphQL.mutate(
      generateSingleMutation<UpdateRegions>({
        schemaName: 'Regions',
        mutationType: 'update',
        data: updateInput,
      })
    )
  }

  insertResourceTag = async (input: NewResourceTags): Promise<GraphQLMutationResult> => {
    const res = await this.services.graphQL.mutate(
      generateSingleMutation<NewResourceTags>({
        schemaName: 'ResourceTags',
        mutationType: 'insert',
        data: input,
      })
    )

    return res
  }
}

export const dataService = new DataServices(Services)
