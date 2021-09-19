import { endOfWeek, startOfWeek } from 'date-fns'

function getFirstDayOfWeek(currentDate: Date) {
  return currentDate.getDate() - currentDate.getDay() + 1
}

function getMonday(currentDate: Date) {
  const updatedDate = new Date(currentDate)
  return new Date(updatedDate.setDate(getFirstDayOfWeek(currentDate)))
}

function getSunday(currentDate: Date) {
  const updatedDate = new Date(currentDate)
  return new Date(updatedDate.setDate(getFirstDayOfWeek(currentDate) + 6))
}

const getTotalHours = (entries: Array<{ start: string; end: string }>) => {
  return entries.reduce((total, { start, end }) => {
    const startHourTime = new Date(start).getTime()
    const endHourTime = new Date(end).getTime()
    const diff = endHourTime - startHourTime
    const hour = diff / (1000 * 3600)
    return total + hour
  }, 0)
}

const getStartEndInCurrentWeek = (currentDate: Date) => {
  const monday = startOfWeek(currentDate, {
    weekStartsOn: 1,
  })
  const sunday = endOfWeek(currentDate, {
    weekStartsOn: 0,
  })
  return {
    start: monday,
    end: sunday,
  }
}

export { getMonday, getSunday, getTotalHours, getStartEndInCurrentWeek }
