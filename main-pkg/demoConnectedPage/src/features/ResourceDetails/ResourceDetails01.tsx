import * as React from 'react'
import { useEffect, useState } from 'react'

import AppServices from '../../services'

const ResourceDetails01 = () => {
  const { getReferenceUIDFromContext, fetchResourceById } = AppServices
  const resourceId = getReferenceUIDFromContext()

  const [resource, setResource] = useState<{ name: string; email: string; phone: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (resourceId) {
      setLoading(true)
      fetchResourceById(resourceId)
        .then((res) => {
          setResource({
            name: res.Name || '',
            email: res.Email || '',
            phone: res.PrimaryPhone || res.MobilePhone || '',
          })
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
      {!loading && !error && (
        <div id="resource_details">
          <div>{'Resource details:'}</div>
          <div>{resource?.name}</div>
          <div>{resource?.email}</div>
          <div>{resource?.phone}</div>
        </div>
      )}
    </>
  )
}

export default ResourceDetails01
