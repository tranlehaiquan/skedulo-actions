import { Type, queries } from 'shared'
import { UpdateResources } from 'shared/dist/__graphql/graphql'

import { getStartEndInCurrentWeek } from '../utils/dateTimeUtils'

import updateResourceMutation from './graphql/updateResource.gql'

import { fetchGraphQl } from './appServices'
import axiosInstance from './httpClient'

import { END_POINTS } from './constants'
import { IAPIResults, IAvailabilitySimpleParams, IAvailabilitySimpleResponse } from './types'

const fetchAvailabilitySimple = async (params: IAvailabilitySimpleParams) => {
  const res = await axiosInstance.get<IAPIResults<IAvailabilitySimpleResponse[]>>(END_POINTS.AVAILABILITY_SIMPLE, {
    params,
  })
  return res.data
}

export const fetchResourceAvailabilitiesInCurrentWeek = async (resourceId: string) => {
  const { start, end } = getStartEndInCurrentWeek(new Date())
  const res = await fetchAvailabilitySimple({
    start: start.toISOString(),
    end: end.toISOString(),
    resource_ids: resourceId,
    mergedAvailabilities: true,
    entries: true,
  })

  return res.result.reduce((acc: IAvailabilitySimpleResponse['entries'], item) => {
    if (item.resourceId === resourceId) {
      return [...acc, ...item.entries.filter((entry) => entry.available)]
    }
    return acc
  }, [])
}

export const fetchResourceById = async (id: string): Promise<Type.ResourceById> => {
  const res = await fetchGraphQl<{ resourcesById: Type.ResourceById }>({
    query: queries.fetchResourceById,
    variables: {
      UID: id,
    },
  })

  return res.resourcesById
}

export const fetchResource = async (variables: Type.GraphqlVariables) => {
  const res = await fetchGraphQl<{ resources: Type.Resources[] }>({
    query: queries.fetchResources,
    variables: {
      ...variables,
      filter: variables.filter || `Name LIKE '%%'`,
    },
  })

  return {
    data: res.resources,
    totalCount: res.resources.length,
  }
}

export const updateResource = async (id: string, payload: Partial<UpdateResources>): Promise<any> => {
  const res = await fetchGraphQl({
    query: updateResourceMutation,
    variables: {
      inputUpdateResource: {
        UID: id,
        ...payload,
      },
    },
  })

  return res
}
