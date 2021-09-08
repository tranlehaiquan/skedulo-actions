import React from 'react'

import { SearchSelect, ISelectItem } from '@skedulo/sked-ui'

import { timezones } from './timezones'

interface TimezonePickerProps {
  timezone?: string | null
  onChange: (timezone: string) => void
}

const timezonesData: ISelectItem[] = timezones.map(timezone => ({ value: timezone, label: timezone }))

const TimezonePicker: React.FC<TimezonePickerProps> = ({ timezone, onChange }) => {
  return (
    <SearchSelect
      items={timezonesData}
      name="timezonePicker"
      selectedItem={timezone ? { value: timezone, label: timezone } : undefined}
      onSelectedItemChange={selected => onChange(selected?.value)}
    />
  )
}

export default TimezonePicker