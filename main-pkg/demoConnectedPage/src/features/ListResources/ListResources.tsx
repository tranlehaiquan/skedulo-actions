import * as React from 'react'
import { Type } from 'shared'
import { useHistory } from 'react-router-dom'

import ListView, { FilterableItem, ColumnType, FILTER_OPERATORS, Operator } from 'shared/dist/components/ListView'

import { IDynamicTableColumn } from '@skedulo/sked-ui/dist/components/dynamic-table/interfaces'
import { IDynamicTable } from '@skedulo/sked-ui'

import { useServices } from '../../contexts/services/ServicesContext'
import { ServiceAdapter } from '../../contexts/services/IServicesContextApdapter'

const SORTABLE_COLUMNS = [
  { label: 'Name', value: 'Name' },
  { label: 'Email', value: 'Email' },
]

const getFilterableColumns = (searchObject: ServiceAdapter['searchObject']): FilterableItem[] => [
  {
    label: 'Name',
    value: 'Name',
    key: 'Name',
    fieldType: ColumnType.string,
    operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.STARTS_WITH, FILTER_OPERATORS.EQUALS],
  },
  {
    label: 'PrimaryRegion',
    value: 'PrimaryRegionId',
    key: 'PrimaryRegion',
    fieldType: ColumnType.picklist,
    operators: [
      {
        value: Operator.Equals,
        label: 'Equal',
        formatFn: (value: string) => {
          return ` == '${value}'`
        },
      },
    ],
    fetchItems: async (searchTerm: string) => {
      try {
        const regions = await searchObject('Regions', searchTerm)
        return regions.map((item) => ({
          label: item.Name,
          value: item.UID,
        }))
      } catch (error) {
        return []
      }
    },
  },
]

export const getTableColumns = ({ onView }: { onView: (uid: string) => void }) => {
  return [
    {
      Header: 'Name',
      accessor: 'Name',
      Cell: ({ cell, row }: Type.TableCellRendererItem<Type.Resources, 'Name'>) => {
        const viewDetail = () => onView(row.original.UID)
        const NameCell = (
          <span className="cx-cursor-pointer" onClick={viewDetail}>
            {cell.value}
          </span>
        )
        return NameCell
      },
    },
    {
      Header: 'Email',
      accessor: 'Email',
    },
    {
      Header: 'Category',
      accessor: 'Category',
    },
    {
      Header: 'Primary Region',
      accessor: 'PrimaryRegion.Name',
    },
  ] as Array<IDynamicTableColumn<Type.Resources>>
}

const ListResources = () => {
  const { fetchResources, searchObject } = useServices()

  const history = useHistory()

  const onView = React.useCallback((resourceId: string) => {
    history.push(`/${resourceId}`)
  }, [])

  const tableConfig: Omit<IDynamicTable<Type.Resources>, 'data'> = React.useMemo(
    () => ({
      columns: getTableColumns({
        onView,
      }),
      stickyHeader: true,
      getRowId: (row: Type.Resources) => row.UID,
      rowSelectControl: 'disabled',
      sortByControl: 'disabled',
      initialRowStateKey: 'UID',
    }),
    [onView]
  )

  const filterableColumns = getFilterableColumns(searchObject)

  return (
    <ListView<Type.Resources>
      schemaName="Resources"
      fetchData={fetchResources}
      tableConfig={tableConfig}
      sortableColumns={SORTABLE_COLUMNS}
      filterableColumns={filterableColumns}
    />
  )
}

export default ListResources
