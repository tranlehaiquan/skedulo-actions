import * as React from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '@skedulo/sked-ui'
import { Type } from 'shared'

import { useServices } from '../../contexts/services/ServicesContext'

const ResourceDetails = () => {
  const { fetchResourceById } = useServices()

  const { resourceId } = useParams<{ resourceId: string }>()

  const [resource, setResource] = useState<Type.Resources | null>(null)
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
      {!loading && !error && (
        <div>
          <Link to="/" className="cx-flex cx-items-center">
            <Icon name="chevronLeft" className="cx-text-primary" />
            <span className="cx-text-primary cx-capitalize">Projects</span>
          </Link>
          <div className="cx-p-4">
            <div className="cx-text-xl">{'Resource details:'}</div>
            <div>{resource?.Name}</div>
            <div>{resource?.Email}</div>
            <div>{resource?.PrimaryRegion.Name}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default ResourceDetails
