/* eslint-disable no-param-reassign */
import { Middleware, KeyedMutator } from 'swr'

import { FetchStatus } from '../commons/constants'

declare module 'swr' {
  interface SWRResponse<Data = any, Error = any> {
    data?: Data
    error?: Error
    mutate: KeyedMutator<Data>
    isValidating: boolean
    // Add global fetchStatus to SWRResponse
    status: FetchStatus
  }
}

export const fetchStatusMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)
    return Object.defineProperty(swr, 'status', {
      get() {
        let status = FetchStatus.Idle

        if (!swr.isValidating && !swr.error && !swr.data) {
          status = FetchStatus.Idle
        } else if (swr.isValidating && !swr.error && !swr.data) {
          status = FetchStatus.Fetching
        } else if (swr.data) {
          status = FetchStatus.Fetched
        } else if (swr.error && !swr.data) {
          status = FetchStatus.Failed
        }
        return status
      },
    })
  }
}
