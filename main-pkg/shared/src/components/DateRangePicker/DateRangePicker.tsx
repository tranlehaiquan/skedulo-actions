import * as React from 'react'
import classnames from 'classnames'

import { Datepicker } from '@skedulo/sked-ui'
import { add, isBefore } from 'date-fns'
import { uniqueId } from 'lodash'

interface DateRangePickerProps {
  onChange: (value: Date[]) => void
  defaultValue?: Date[]
  dateFormat?: string
  className?: string
}

const START_PICKER_ELEMENT_ID = 'DateRangePicker__StartPicker__'
const END_PICKER_ELEMENT_ID = 'DateRangePicker__EndPicker__'

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  dateFormat,
  className,
  defaultValue = []
}) => {
  const [start, setStart] = React.useState<Date>(defaultValue[0] ? new Date(defaultValue[0]) : new Date())
  const [end, setEnd] = React.useState<Date>(defaultValue[1] ? new Date(defaultValue[1]) : add(new Date(), { days: 1 }))
  const [startPickerElementId, endPickerElementId] = React.useMemo(() => {
    return [uniqueId(START_PICKER_ELEMENT_ID), uniqueId(END_PICKER_ELEMENT_ID)]
  }, [])

  const handleChange = React.useCallback(
    (dateRange: Date[]) => {
      onChange(dateRange)
    },
    []
  )

  const onStartChange = React.useCallback((selectedStart: Date) => {
    if (!selectedStart) {
      handleChange([])
      return
    }
    setStart(selectedStart)
    if (!isBefore(selectedStart, end)) {
      const newEnd = add(selectedStart, { days: 1 })
      setEnd(newEnd)
    }
    const endPickerElement = document.getElementById(endPickerElementId)
    if (endPickerElement) {
      endPickerElement.focus()
    }
  }, [end, endPickerElementId, handleChange])

  const onEndChange = React.useCallback((selectedEnd: Date) => {
    if (!selectedEnd) {
      handleChange([])
      return
    }
    if (isBefore(start, selectedEnd)) {
      setEnd(selectedEnd)
    }
  }, [start, handleChange])

  React.useEffect(() => {
    if (start && end) {
      handleChange([start, end])
    }
  }, [start, end])

  return (
    <div
      className={classnames(
        'cx-flex cx-items-center',
        className
      )}
    >
      <Datepicker
        selected={start}
        dateFormat={dateFormat}
        onChange={onStartChange}
        id={startPickerElementId}
      />
      <Datepicker
        className="cx-ml-2"
        selected={end}
        dateFormat={dateFormat}
        onChange={onEndChange}
        openToDate={end}
        minDate={add(start, { days: 1 })}
        id={endPickerElementId}
      />
    </div>
  )
}

export default React.memo(DateRangePicker)
