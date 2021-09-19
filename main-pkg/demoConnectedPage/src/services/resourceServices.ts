import { Resources } from 'shared/dist/__graphql/graphql'

import { getStartEndInCurrentWeek, getTotalHours } from '../utils/dateTimeUtils'

import fetchResourceQuery from './graphql/fetchResources.gql'
import fetchResourceByIdQuery from './graphql/fetchResourceById.gql'

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

const fetchResourceAvailabilitiesInCurrentWeek = async (resourceId: string) => {
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

export const fetchResourceById = async (id: string): Promise<Resources> => {
  const res = await fetchGraphQl<{ resourcesById: Resources }>({
    query: fetchResourceByIdQuery,
    variables: {
      UID: id,
    },
  })

  return res.resourcesById
}

export const fetchResource = async (filter = `Name LIKE '%%'`) => {
  const res = await fetchGraphQl<{ resources: Resources[] }>({
    query: fetchResourceQuery,
    variables: {
      filterResource: filter,
    },
  })

  return res.resources
}

export const getMaxRequestedWorkingHoursPerWeek = async (resourceId: string): Promise<number> => {
  const entries = await fetchResourceAvailabilitiesInCurrentWeek(resourceId)
  const max = getTotalHours(entries)
  return max
}
