import * as React from 'react'
import { memo, useCallback, FC } from 'react'
import { Button, ISelectItem, PopOut } from '@skedulo/sked-ui'

import ColumnsCustomization from './ColumnsCustomization'

interface ColumnsCustomizationPopoutProps {
  onChange: (shownColumnValues: string[]) => void
  columns: Array<ISelectItem<string>>
  shownColumns: Array<ISelectItem<string>>
}

const ColumnsCustomizationPopout: FC<ColumnsCustomizationPopoutProps> = props => {
  const { columns, shownColumns, onChange } = props

  const renderTrigger = useCallback(() => {
    return <Button buttonType="secondary" icon="grid">Columns</Button>
  }, [])

  const renderContent = useCallback((hideDropdown: () => void) => {
    return (
      <ColumnsCustomization
        columns={columns}
        onChange={onChange}
        hideDropdown={hideDropdown}
        shownColumns={shownColumns}
      />
    )
  }, [columns, onChange, shownColumns])

  return (
    <PopOut
      trigger={renderTrigger}
    >
      {renderContent}
    </PopOut>
  )
}

export default memo(ColumnsCustomizationPopout)
