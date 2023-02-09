import moment from 'moment-timezone'
import { differenceInMinutes, parseISO } from 'date-fns'

import { M_DATETIME_TZ_FORMAT } from '../constants'

const hoursLabel = (hours: number) => hours > 0 ? `${hours}h` : ''

const minutesLabel = (minutes: number) =>  minutes > 0 ? `${minutes}m` : ''

export const minutesToDuration = (totalMinutes?: number) => {
  if (totalMinutes === null || totalMinutes === undefined) {
    return undefined
  }

  if (totalMinutes === 0) {
    return 0
  }

  const roundedMinutes = Math.round(totalMinutes)

  const hours = Math.floor(roundedMinutes / 60)
  const minutes = roundedMinutes % 60
  return `${hoursLabel(hours)} ${minutesLabel(minutes)}`
}

export const getTimeGapHrs = (timezone: string) => {
  if (!timezone) {
    return 0
  }

  const tzOffset = moment.tz(timezone).utcOffset() / 60
  const currentOffset = moment().utcOffset() / 60

  return currentOffset - tzOffset
}

export const formatTZDatetimeString = (date: Date | string, timezone: string, format?: string) => {
  if (!date || !timezone) {
    return ''
  }

  return moment.tz(date, timezone).format(format || M_DATETIME_TZ_FORMAT)
}

export const parseLocalDateToZonedDate = (date: Date | string, timezone: string) => {
  return moment.tz(date, timezone).toDate()
}

export const calculateDurationInMinutes = (startISO?: string, endISO?: string) => {
  if (!startISO || !endISO) {
    return undefined
  }

  const totalMinutes = differenceInMinutes(parseISO(endISO), parseISO(startISO))

  return totalMinutes
}
