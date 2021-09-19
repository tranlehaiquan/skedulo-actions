export interface IAPIResults<T> {
  result: T
}

export interface IResourcesAvailabilitiesBody {
  start: string
  end: string
  unavailability?: true
  availability?: true
  resourceIds: string[]
  regionIds?: string[]
  resourceFilter?: string
}

export interface IAvailabilitySimpleParams {
  resource_ids: string
  start: string
  end: string
  mergedAvailabilities?: boolean
  entries?: boolean
}

export interface IAvailabilitySimpleResponse {
  resourceId: string
  mergedAvailabilities: Array<{
    start: string
    end: string
  }>
  entries: Array<{
    name: string
    templateId: string
    available: boolean
    end: string
    type: string
    start: string
    templateEntryId: string
  }>
}
