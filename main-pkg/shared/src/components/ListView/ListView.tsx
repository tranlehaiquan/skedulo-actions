import * as React from 'react'

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  SetStateAction,
} from 'react'

import {
  ButtonGroup,
  DynamicTable,
  IDynamicTable,
  ISelectItem,
  Pagination,
} from '@skedulo/sked-ui'
import { IDynamicTableColumn } from '@skedulo/sked-ui/dist/components/dynamic-table/interfaces'
import { fromPairs } from 'lodash'

import { useGlobalLoading } from '../GlobalLoading'

// import { toastMessage } from '../../utils'

import {
  FilterableItem,
  FilterParams,
  GraphqlVariables,
  OrderParams,
  PageParams,
  TransformedListResponse,
} from './types'
import { DEFAULT_PAGE_PARAMS } from './constansts'

import ColumnsCustomizationPopout from './components/ColumnsCustomizationPopout'
import FilterPopout from './components/FilterPopout'
import SortPopout from './components/SortPopout'

interface ListViewProps<T extends object> {
  schemaName: string
  fetchData: (
    variables: GraphqlVariables
  ) => Promise<TransformedListResponse<T>>
  tableConfig: Omit<IDynamicTable<T>, 'data'>
  sortableColumns?: Array<ISelectItem<string>>
  filterableColumns?: FilterableItem[]
  forceUpdate?: boolean
  setForceUpdate?: React.Dispatch<SetStateAction<boolean>>
}

interface QueryParams {
  filter: string[]
  orderBy: string[]
  rawFilter?: Record<string, string>
  rawOrderBy?: Record<string, string>
}

const ListView = <T extends object>(props: ListViewProps<T>): JSX.Element => {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading()
  const {
    fetchData,
    tableConfig,
    sortableColumns,
    filterableColumns,
    schemaName,
    forceUpdate,
    setForceUpdate,
  } = props

  const [listData, setListData] = useState<TransformedListResponse<T>>({
    data: [],
    totalCount: 0,
  })

  const [columns, setColumns] = useState<Array<IDynamicTableColumn<T>>>(() => {
    const storedColumnsConfig = localStorage.getItem(
      `COLUMNS_CONFIG_${schemaName}`
    )
    const shownItems = storedColumnsConfig
      ? JSON.parse(storedColumnsConfig)
      : []
    return shownItems.length
      ? tableConfig.columns.filter(item => shownItems.includes(item.accessor) || !item.Header)
      : tableConfig.columns
  })

  // all columns can config show/hide
  const availableColumns = useMemo(() => {
    return tableConfig.columns
      .filter((column) => column.Header)
      .map((column) => ({
        label: column.Header,
        value: column.accessor,
      })) as Array<ISelectItem<string>>
  }, [tableConfig.columns])

  // current shown columns
  const shownColumns = useMemo(() => {
    return columns
      .filter((column) => column.Header)
      .map((column) => ({
        label: column.Header,
        value: column.accessor,
      })) as Array<ISelectItem<string>>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, schemaName])

  const [pageParams, setPageParams] = useState<PageParams>(DEFAULT_PAGE_PARAMS)
  const [queryParams, setQueryParams] = useState<QueryParams>({
    filter: [],
    orderBy: [],
  })

  const [appliedFilter, setAppliedFilter] = useState<FilterParams[]>([])
  const [appliedSorter, setAppliedSorter] = useState<OrderParams[]>([])

  const getListData = useCallback(async (variables: GraphqlVariables) => {
    try {
      startGlobalLoading()
      const resp = await fetchData(variables)
      setListData(resp)
      if (setForceUpdate instanceof Function) {
        setForceUpdate(false)
      }
    } catch (error) {
      // toastMessage.error(error.message)
    } finally {
      endGlobalLoading()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPageNumberChange = useCallback((pageNumber: number) => {
    setPageParams((prev) => ({ ...prev, pageNumber }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onColumnConfigChange = useCallback(
    (shownColumns: string[]) => {
      localStorage.setItem(
        `COLUMNS_CONFIG_${schemaName}`,
        JSON.stringify(shownColumns)
      )
      setColumns(
        tableConfig.columns.filter((item) =>
          shownColumns.includes(item.accessor as string)
        )
      )
    },
    [tableConfig.columns, schemaName]
  )

  const onOrderConfigChange = useCallback((appliedItems: OrderParams[]) => {
    setQueryParams((prev) => ({
      ...prev,
      orderBy: appliedItems.map((item) => `${item.orderBy} ${item.orderType} NULLS LAST`),
      rawOrderBy: fromPairs(appliedItems.map((item) => [item.orderBy, item.orderType]))
    }))
    setAppliedSorter(appliedItems)
  }, [])

  const onFilterConfigChange = useCallback((appliedItems: FilterParams[]) => {
    const filterConditions = appliedItems.map((item) => {
      const fieldName = item.filterBy?.value || ''
      const operatorItem = item.filterBy?.operators.find(
        (operator) => operator.value === item.operator
      )
      return `${fieldName} ${operatorItem?.formatFn(item.value, item.originalValue) || ''}`
    })

    const rawConditions = appliedItems.map((item) => {
      const fieldName = item.filterBy?.value || ''
      const operatorItem = item.filterBy?.operators.find(
        (operator) => operator.value === item.operator
      )
      return [fieldName, operatorItem?.formatFn(item.value, item.originalValue) || '']
    })
    onPageNumberChange(1)
    setQueryParams((prev) => ({
      ...prev,
      filter: filterConditions,
      rawFilter: fromPairs(rawConditions)
    }))
    setAppliedFilter(appliedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const offset = pageParams.pageSize * (pageParams.pageNumber - 1)
    getListData({
      filter: queryParams.filter ? queryParams.filter.join(' AND ') : '',
      orderBy: queryParams.orderBy.join(',') || 'CreatedDate DESC',
      offset: offset,
      first: pageParams.pageSize,
      rawParams: {
        pageParams,
        orderBy: queryParams.rawOrderBy,
        filterBy: queryParams.rawFilter,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, pageParams])

  useEffect(() => {
    if (forceUpdate) {
      getListData({
        filter: '',
        orderBy: 'CreatedDate DESC',
        offset: 0,
        first: DEFAULT_PAGE_PARAMS.pageSize,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceUpdate, setForceUpdate])

  return (
    <div className="cx-bg-white cx-p-4">
      <div className="cx-flex cx-items-center cx-justify-between cx-pb-4">
        <div className="cx-flex cx-items-center">
          <h6 className="cx-text-neutral-600">{listData.totalCount} item/s</h6>
        </div>
        <ButtonGroup>
          {filterableColumns && (
            <FilterPopout
              onChange={onFilterConfigChange}
              columns={filterableColumns}
              appliedItems={appliedFilter}
            />
          )}
          {sortableColumns && (
            <SortPopout
              onChange={onOrderConfigChange}
              columns={sortableColumns}
              appliedItems={appliedSorter}
            />
          )}
          <ColumnsCustomizationPopout
            onChange={onColumnConfigChange}
            columns={availableColumns}
            shownColumns={shownColumns}
          />
        </ButtonGroup>
      </div>
      <DynamicTable {...tableConfig} data={listData.data} columns={columns} />
      {listData.totalCount === 0 && (
        <p className="cx-text-center cx-text-neutral-600 cx-p-4">
          No data found.
        </p>
      )}
      {listData.totalCount > 0 && (
        <Pagination
          itemsTotal={listData.totalCount}
          itemsPerPage={pageParams.pageSize}
          currentPage={pageParams.pageNumber || 1}
          onPageChange={onPageNumberChange}
          className="cx-static"
        />
      )}
    </div>
  )
}

export default ListView
