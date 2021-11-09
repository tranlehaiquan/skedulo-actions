import * as React from 'react'
import { memo, useCallback, FC } from 'react'
import { Button, PopOut } from '@skedulo/sked-ui'

import { FilterableItem, FilterParams } from '../../types'

import Filter from './Filter'

interface FilterPopoutProps {
  onChange: (appliedItems: FilterParams[]) => void
  columns: FilterableItem[]
  appliedItems: FilterParams[]
}

const FilterPopout: FC<FilterPopoutProps> = props => {
  const { columns, appliedItems, onChange } = props

  const renderTrigger = useCallback(() => (
    <Button buttonType="secondary" icon="filterFunnel">Filter</Button>
  ), [])

  const renderContent = useCallback((hideDropdown: () => void) => (
    <Filter
      columns={columns}
      onChange={onChange}
      hideDropdown={hideDropdown}
      appliedItems={appliedItems}
    />
  ), [columns, onChange, appliedItems])

  return (
    <PopOut
      trigger={renderTrigger}
    >
      {renderContent}
    </PopOut>
  )
}

export default memo(FilterPopout)
