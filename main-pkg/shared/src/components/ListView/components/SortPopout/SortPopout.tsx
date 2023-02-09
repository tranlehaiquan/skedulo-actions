import * as React from 'react'
import { memo, useCallback, FC } from 'react'
import { Button, ISelectItem, PopOut } from '@skedulo/sked-ui'

import { OrderParams } from '../../types'

import Sort from './Sort'

interface SortPopoutProps {
  onChange: (appliedItems: OrderParams[]) => void
  columns: Array<ISelectItem<string>>
  appliedItems: OrderParams[]
}

const SortPopout: FC<SortPopoutProps> = props => {
  const { columns, appliedItems, onChange } = props

  const renderTrigger = useCallback(() => {
    return <Button buttonType="secondary" icon="sortAscending">Sort</Button>
  }, [])

  const renderContent = useCallback((hideDropdown: () => void) => (
    <Sort
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

export default memo(SortPopout)
