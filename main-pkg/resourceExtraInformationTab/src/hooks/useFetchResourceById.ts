import { useCallback, useEffect, useState } from 'react'
import { Resources } from 'shared/dist/__graphql/graphql'

import { useServices } from '../contexts/services/ServicesContext'

export default (id: string, immediatelyFetch?: boolean) => {
  const { fetchResourceById } = useServices()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [resource, setResource] = useState<Resources | null>(null)

  const fetchResourceByIdCallback = useCallback(async () => {
    if (id) {
      try {
        setIsLoading(true)
        const res = await fetchResourceById(id)
        setResource(res)
        return res
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
        return null
      }
    } else {
      setError('Resource not found')
      return null
    }
  }, [id, fetchResourceById])

  useEffect(() => {
    if (immediatelyFetch) {
      fetchResourceByIdCallback()
    }
  }, [immediatelyFetch, fetchResourceByIdCallback])

  return {
    error,
    resource,
    isLoading,
    fetchResourceByIdCallback,
  }
}
