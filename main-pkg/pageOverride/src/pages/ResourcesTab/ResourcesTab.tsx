import React, { memo, useState, useCallback, useMemo, useEffect } from 'react'

import {
  Button,
  DynamicTable,
  IDynamicTable
} from '@skedulo/sked-ui'
import { IDynamicTableColumn } from '@skedulo/sked-ui/dist/components/dynamic-table/interfaces'

import { useGlobalLoading } from 'shared/dist/components'
import { Resources } from 'shared/dist/__graphql/graphql'
import { TableCellRendererItem } from 'shared/dist/types'

import { dataService } from '../../services/DataServices'

import AssignTagPopout from '../../components/AssignTagPopout'
import { toastMessage } from '../../commons/utils'

const { fetchResources } = dataService

export const tableColumns = ({
  submitCb,
}: {
  submitCb: () => Promise<void>
}) => {
  return [
    {
      Header: 'Name',
      accessor: 'Name',
      width: '50%',
    },
    {
      Header: 'Tags',
      accessor: 'ResourceTags',
      emptyCellText: '-',
      Cell: ({ cell }: TableCellRendererItem<Resources, 'ResourceTags'>) => {
        return cell.value.map((item) => item.Tag.Name).join(', ')
      },
    },
    {
      Header: 'UID',
      accessor: 'UID',
      Cell: ({ row }: TableCellRendererItem<Resources, 'UID'>) => {
        return (
          <div className="cx-mb-4 cx-flex">
            <AssignTagPopout
              resourceId={row.original.UID}
              trigger={<Button buttonType="transparent" icon="plus" className="cx-text-primary">Add Tag</Button>}
              submitCb={submitCb}
              excludedTagIds={row.original.ResourceTags.map((item) => item.UID)}
            />
          </div>
        )
      },
    },
  ] as IDynamicTableColumn<Resources>[]
}

const ResourcesTab: React.FC<{ regionId: string }> = ({ regionId }) => {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading()
  const [resources, setResources] = useState<Resources[]>([])

  const getResources = useCallback(async (primaryRegionId: string) => {
    try {
      startGlobalLoading()
      // TODO: support pagination
      const res = await fetchResources(`PrimaryRegionId == '${primaryRegionId}'`)

      setResources(res.data)
    } catch (error) {
      toastMessage.error('Fetch error!')
    } finally {
      endGlobalLoading()
    }
  }, [])

  const submitCb = useCallback(async () => {
    return await getResources(regionId)
  }, [regionId])

  useEffect(() => {
    if (regionId) {
      getResources(regionId)
    }
  }, [regionId])

  const tableConfig: IDynamicTable<Resources> = useMemo(
    () => ({
      data: resources,
      columns: tableColumns({ submitCb }),
      stickyHeader: true,
      getRowId: (row: Resources) => row.UID,
      rowSelectControl: 'disabled',
      sortByControl: 'disabled',
      initialRowStateKey: 'id',
    }),
    [resources, submitCb]
  )

  return (
    <div className="cx-p-4 cx-bg-white">
      <DynamicTable wrapperClassName="cx-mt-b4" {...tableConfig} />
      {!resources.length && <div className="cx-p-4 cx-text-neutral-650 cx-text-center">No data found.</div>}
    </div>
  )
}

export default memo(ResourcesTab)
