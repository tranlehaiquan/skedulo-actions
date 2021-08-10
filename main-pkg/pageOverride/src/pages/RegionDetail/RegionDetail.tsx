import React, { useState, useCallback, useEffect } from 'react'
import _isEqual from 'lodash/isEqual'

import { LoadingTrigger, useGlobalLoading } from 'shared/dist/components/GlobalLoading'
import ObjectDetailWrapper from 'shared/dist/components/ObjectDetailWrapper'
import { Regions, UpdateRegions } from 'shared/dist/__graphql/graphql'

import { TAB_OPTIONS, TAB_ROUTES } from '../../commons/constants'
import { dataService } from '../../services/DataServices'
import { toastMessage } from '../../commons/utils'

import RegionFormTab from '../RegionFormTab'
import ResourcesTab from '../ResourcesTab'

const REGIONS_HREF = '/l/regions'

interface RegionDetailProps {
  UID: string
}

const RegionDetail = ({ UID }: RegionDetailProps) => {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading()
  const [region, setRegion] = useState<Regions>()

  const getRegionDetail = useCallback(async (regionId: string) => {
    try {
      startGlobalLoading()
      const res = await dataService.fetchRegionById(regionId)

      if (res) {
        setRegion(res)
      }
    } catch (error) {
      toastMessage.error('Fetch region failed.')
      handleGoBack()
    } finally {
      endGlobalLoading()
    }
  }, [])

  const handleGoBack = useCallback(async () => {
    window.top.window.location.href = REGIONS_HREF
  }, [])

  const handleDelete = useCallback(async () => {
    if (UID) {
      console.log('delete')
    }
  }, [UID])

  const handleUpdate = useCallback(async (updateData: UpdateRegions) => {
    if (!_isEqual(updateData, region)) {
      try {
        startGlobalLoading()
        await dataService.updateRegion(updateData)
        getRegionDetail(updateData.UID)
      } catch (error) {
        toastMessage.error('Update failed.')
      } finally {
        endGlobalLoading()
      }
    }
  }, [region])

  useEffect(() => {
    if (UID) {
      getRegionDetail(UID)
    } else {
      handleGoBack()
    }
  }, [UID])

  if (!region) {
    return <LoadingTrigger />
  }

  return (
    <ObjectDetailWrapper<Regions>
      UID={UID}
      objectType="Regions"
      objectListUrl={REGIONS_HREF}
      getObject={dataService.fetchRegionById}
      deleteObject={handleDelete}
      tabs={TAB_OPTIONS}
    >
      {(activeRoute: string) => {
        if (activeRoute === TAB_ROUTES.OVERVIEW) {
          return <RegionFormTab region={region} handleUpdate={handleUpdate} />
        }
        if (activeRoute === TAB_ROUTES.RESOURCES) {
          return <ResourcesTab regionId={UID} />
        }
        return <div className="cx-hidden" />
      }}
    </ObjectDetailWrapper>
  )
}

export default RegionDetail
