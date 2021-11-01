import * as React from 'react'
import { memo, useState, useCallback, useMemo, FC } from 'react'
import { Button, IconButton, ISelectItem, SearchSelect } from '@skedulo/sked-ui'
import { clone } from 'lodash'

import { OrderParams } from '../../types'

interface SortProps {
  onChange: (sortedItems: OrderParams[]) => void
  columns: Array<ISelectItem<string>>
  hideDropdown: () => void
  appliedItems: OrderParams[]
}

const SORT_TYPE_LABELS = {
  ASC: 'Ascending',
  DESC: 'Descending'
}

const SORT_TYPE_OPTIONS = [
  { label: SORT_TYPE_LABELS.ASC, value: 'ASC' },
  { label: SORT_TYPE_LABELS.DESC, value: 'DESC' }
]

const Sort: FC<SortProps> = props => {
  const { onChange, columns, hideDropdown, appliedItems } = props

  const [sortItems, setSortItems] = useState<OrderParams[]>(appliedItems)

  const orderByOptions = useMemo(() => {
    const sortItemValues = sortItems.map(item => item.orderBy)
    return columns.filter(item => !sortItemValues.includes(item.value))
  }, [sortItems, columns])

  const onItemAdd = useCallback(() => {
    setSortItems(prev => {
      const newState = clone(prev)
      newState.push({
        orderBy: '',
        orderType: 'ASC'
      })
      return newState
    })
  }, [])

  const onItemRemove = useCallback((itemIndex: number) => {
    setSortItems(prev => prev.filter((item, index) => index !== itemIndex))
  }, [])

  const onItemChange = useCallback((fieldName: string, itemIndex: number) => (selectedItem: ISelectItem<string>) => {
    setSortItems(prev => {
      if (!selectedItem) {
        return prev
      }
      const newState = clone(prev)
      const newItem = {
        ...newState[itemIndex],
        [fieldName]: selectedItem.value
      }
      newState[itemIndex] = newItem
      return newState
    })
  }, [])

  const onApply = useCallback(() => {
    onChange(sortItems)
    hideDropdown()
  }, [sortItems, onChange, hideDropdown])

  return (
    <div className="cx-bg-white cx-p-4 cx-shadow cx-min-w-420px">
      {sortItems.map((item, index) => (
        <div className="cx-pb-2 cx-grid cx-grid-cols-sort cx-gap-2 cx-items-center" key={`${item.orderType}_${item.orderBy}_${index}`}>
          <SearchSelect
            items={orderByOptions}
            selectedItem={item.orderBy ? { value: item.orderBy, label: item.orderBy } : undefined}
            onSelectedItemChange={onItemChange('orderBy', index)}
          />
          <SearchSelect
            items={SORT_TYPE_OPTIONS}
            selectedItem={item.orderType ? { value: item.orderType, label: item.orderType } : undefined}
            onSelectedItemChange={onItemChange('orderType', index)}
          />
          {<IconButton icon="trash" onClick={() => onItemRemove(index)} tooltipContent="remove" className="cx-justify-self-end" />}
        </div>
      ))}
      <Button
        buttonType="transparent"
        icon="plus"
        onClick={onItemAdd}
        disabled={columns.length === sortItems.length}
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

export default memo(Sort)
