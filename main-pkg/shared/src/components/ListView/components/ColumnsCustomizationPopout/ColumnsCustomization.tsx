import * as React from 'react'
import { memo, useState, useCallback, FC, ChangeEvent } from 'react'
import { clone } from 'lodash'
import { Button, FormInputElement, ISelectItem } from '@skedulo/sked-ui'

interface ColumnsCustomizationProps {
  onChange: (shownColumnValues: string[]) => void
  columns: Array<ISelectItem<string>>
  shownColumns: Array<ISelectItem<string>>
  hideDropdown: () => void
}

const ColumnsCustomization: FC<ColumnsCustomizationProps> = props => {
  const { onChange, columns, hideDropdown, shownColumns } = props
  const [shownColumnValues, setShownColumnValues] = useState<string[]>(shownColumns.map(item => item.value))

  const onColumnsChange = useCallback((value: string) => (e: ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setShownColumnValues(prev => {
      let newState = clone(prev)
      if (e.target.checked) {
        newState.push(value)
      } else if (newState.length > 1) {
        newState = newState.filter(item => item !== value)
      }
      return newState
    })
  }, [])

  const onApply = useCallback(() => {
    onChange(shownColumnValues)
    hideDropdown()
  }, [shownColumnValues, onChange, hideDropdown])

  return (
    <div className="cx-bg-white cx-p-4 cx-shadow">
      {columns.map(item => (
        <div className="cx-pb-2" key={item.value}>
          <FormInputElement
            inlineLabel={item.label}
            value={item.value}
            checked={shownColumnValues.includes(item.value)}
            onChange={onColumnsChange(item.value)}
            type="checkbox"
          />
        </div>
      ))}
      <div className="cx-text-right">
        <Button buttonType="transparent" onClick={hideDropdown}>Cancel</Button>
        <Button buttonType="primary" onClick={onApply}>Apply</Button>
      </div>
    </div>
  )
}

export default memo(ColumnsCustomization)
