import * as React from 'react'
import { memo, useState, useCallback, useMemo, FC } from 'react'

import {
  AsyncMultiSearchSelect,
  AsyncSearchSelect,
  Button,
  Datepicker,
  FormInputElement,
  IconButton,
  ISelectItem,
  MultiSearchSelect,
  SearchSelect
} from '@skedulo/sked-ui'
import { clone } from 'lodash'
import { format } from 'date-fns'

import { GRAPHQL_DATE_FORMAT } from '../../constansts'
import DateRangePicker from '../../../DateRangePicker'

import { ColumnType, FilterableItem, FilterParams, Operator } from '../../types'

interface FilterProps {
  onChange: (appliedItems: FilterParams[]) => void
  columns: FilterableItem[]
  hideDropdown: () => void
  appliedItems: FilterParams[]
}

interface GenerateFilterInputParams {
  filterBy: FilterableItem
  value: string
  onChange: (newValue: string, originalValue?: any) => void
  className?: string
  originalValue?: any
  operator: Operator | null
}

const generateFilterInput = ({ filterBy, value, onChange, className, originalValue, operator }: GenerateFilterInputParams) => {
  switch (filterBy.fieldType) {
    case ColumnType.string:
      return (
        <FormInputElement
          className={className}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )
    case ColumnType.number:
      return (
        <FormInputElement
          className={className}
          value={value}
          onChange={e => onChange(/[0-9]/g.test(e.target.value) ? e.target.value : '')}
        />
      )
    case ColumnType.date:
      if (operator === Operator.Between) {
        return (
          <DateRangePicker
            className={className}
            defaultValue={originalValue || []}
            dateFormat="MMM dd, yyyy"
            onChange={(selectedRange: Date[]) => {
              if (selectedRange.length) {
                const start = format(selectedRange[0], GRAPHQL_DATE_FORMAT)
                const end = format(selectedRange[1], GRAPHQL_DATE_FORMAT)
                onChange(start, [start, end])
              } else {
                onChange('', [])
              }
            }}
          />
        )
      }
      return (
        <Datepicker
          className={className}
          selected={value ? new Date(value) : new Date()}
          dateFormat="MMM dd, yyyy"
          onChange={(selectedDate: Date) => {
            onChange(format(selectedDate, GRAPHQL_DATE_FORMAT))
          }}
        />
      )
    case ColumnType.multipicklist:
      if (filterBy.fetchItems) {
        return (
          <AsyncMultiSearchSelect
            fetchItems={filterBy.fetchItems}
            className={className}
            initialSelectedItems={originalValue?.length > 0 ? originalValue : []}
            onSelectedItemsChange={(selectedItems: ISelectItem[]) => {
              onChange(JSON.stringify(selectedItems.map(item => item.value)), selectedItems)
            }}
            fetchStrategy="onMount"
          />
        )
      }

      return (
        <MultiSearchSelect
          items={filterBy.items || []}
          className={className}
          initialSelectedItems={originalValue?.length > 0 ? originalValue : []}
          onSelectedItemsChange={(selectedItems: ISelectItem[]) => {
            onChange(JSON.stringify(selectedItems.map(item => item.value)))
          }}
        />
      )
    case ColumnType.picklist:
      if (filterBy.fetchItems) {
        return (
          <AsyncSearchSelect
            fetchItems={filterBy.fetchItems}
            className={className}
            initialSelectedItem={originalValue || undefined}
            onSelectedItemChange={(selectedItem: ISelectItem) => {
              onChange(selectedItem?.value || '', selectedItem)
            }}
          />
        )
      }

      return (
        <SearchSelect
          items={filterBy.items || []}
          className={className}
          initialSelectedItem={originalValue || undefined}
          onSelectedItemChange={(selectedItem: ISelectItem) => {
            onChange(selectedItem?.value || '', selectedItem)
          }}
        />
      )
    default:
      break
  }
}

const Filter: FC<FilterProps> = props => {
  const { onChange, columns, hideDropdown, appliedItems } = props

  const [filterItems, setFilterItems] = useState<FilterParams[]>(appliedItems)

  const filterByOptions = useMemo(() => {
    const filterItemValues = filterItems.map(item => item.filterBy?.key)
    return columns.filter(item => !filterItemValues.includes(item.key))
  }, [filterItems, columns])

  const onItemAdd = useCallback(() => {
    setFilterItems(prev => {
      const newState = clone(prev)
      newState.push({
        filterBy: null,
        operator: null,
        value: ''
      })
      return newState
    })
  }, [])

  const onItemRemove = useCallback((itemIndex: number) => {
    setFilterItems(prev => prev.filter((item, index) => index !== itemIndex))
  }, [])

  const onFilterByChange = useCallback((itemIndex: number) => (selectedItem: FilterableItem) => {
    setFilterItems(prev => {
      if (!selectedItem) {
        return prev
      }
      const newState = clone(prev)
      const newItem = {
        ...newState[itemIndex],
        filterBy: selectedItem,
        operator: null,
        value: selectedItem.fieldType === ColumnType.date ? format(new Date(), GRAPHQL_DATE_FORMAT) : ''
      }
      newState[itemIndex] = newItem
      return newState
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  const onOperatorChange = useCallback((itemIndex: number) => (selectedItem: ISelectItem<string>) => {
    setFilterItems(prev => {
      if (!selectedItem) {
        return prev
      }
      const newState = clone(prev)
      const newItem = {
        ...newState[itemIndex],
        operator: selectedItem.value as Operator
      }
      newState[itemIndex] = newItem
      return newState
    })
  }, [])

  const onValueChange = useCallback((itemIndex: number) => (newValue: string, originalValue?: any) => {
    setFilterItems(prev => {
      const newState = clone(prev)
      const newItem = {
        ...newState[itemIndex],
        originalValue,
        value: newValue
      }
      newState[itemIndex] = newItem
      return newState
    })
  }, [])

  const onApply = useCallback(() => {
    const validItems = filterItems.filter(item => item.filterBy && item.operator && item.value)
    onChange(validItems)
    hideDropdown()
  }, [filterItems, onChange, hideDropdown])

  return (
    <div className="cx-bg-white cx-p-4 cx-shadow cx-min-w-640px">
      {filterItems.map((item, index) => {
        const onInputChange = onValueChange(index)
        return (
          <div
            className="cx-pb-2 cx-grid cx-grid-cols-filter cx-gap-2 cx-items-center"
            key={`${item.filterBy?.key || 'filterBy'}_${item.operator || 'operator'}_${index}`}
          >
            <SearchSelect
              items={filterByOptions}
              selectedItem={item.filterBy || undefined}
              onSelectedItemChange={onFilterByChange(index)}
            />
            {(item.filterBy?.operators?.length || 0) > 0 && (
              <SearchSelect
                items={item.filterBy?.operators || []}
                selectedItem={item.operator ? item.filterBy?.operators.find(operator => operator.value === item.operator) : undefined}
                onSelectedItemChange={onOperatorChange(index)}
              />
            )}
            {item.filterBy?.fieldType && generateFilterInput({
              filterBy: item.filterBy,
              value: item.value,
              operator: item.operator,
              originalValue: item.originalValue,
              onChange: onInputChange
            })}
            {<IconButton icon="trash" onClick={() => onItemRemove(index)} tooltipContent="remove" className="cx-justify-self-end" />}
          </div>
        )
      })}
      <Button
        buttonType="transparent"
        icon="plus"
        onClick={onItemAdd}
        disabled={columns.length === filterItems.length}
      >
        Add item
      </Button>
      <div className="cx-text-right">
        <Button buttonType="transparent" onClick={hideDropdown}>Cancel</Button>
        <Button buttonType="primary" onClick={onApply}>Apply</Button>
      </div>
    </div>
  )
}

export default memo(Filter)
