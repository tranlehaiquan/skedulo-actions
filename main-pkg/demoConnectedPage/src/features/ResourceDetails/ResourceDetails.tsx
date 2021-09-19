import React, { useEffect, useState } from 'react'
import { Resources } from 'shared/dist/__graphql/graphql'

import { useServices } from '../../contexts/services/ServicesContext'

const ResourceDetails = () => {
  const { fetchResourceById, getReferenceUIDFromContext } = useServices()

  const resourceId = getReferenceUIDFromContext()

  const [resource, setResource] = useState<Resources | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (resourceId) {
      setLoading(true)
      fetchResourceById(resourceId)
        .then((res) => {
          setResource(res)
        })
        .catch((err) => {
          setError(err?.message || 'Something went wrong.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [resourceId, fetchResourceById])

  return (
    <>
      {loading && <div>{'Loading...'}</div>}
      {error && <div id="error_messasge">{error}</div>}
      <div id="resource_name">{resource?.Name}</div>
    </>
  )
}

export default ResourceDetails
