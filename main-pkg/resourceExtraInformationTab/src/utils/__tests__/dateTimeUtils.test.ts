import { getMonday, getSunday, getTotalHours, getStartEndInCurrentWeek } from '../dateTimeUtils'

describe('DateTimeUtils', () => {
  describe('getMonday', () => {
    it('Wed 15/09/2021, it should return Mon 13/09/2021', () => {
      const monday = getMonday(new Date(2021, 8, 15))
      expect(monday.toString()).toBe(new Date(2021, 8, 13).toString())
    })
    it('Wed 15/09/2021, it should return Mon 13/09/2021', () => {
      const monday = getMonday(new Date('2021-09-15T00:00:00.000Z'))
      expect(monday.toISOString()).toBe('2021-09-13T00:00:00.000Z')
    })
    it('Mon 13/09/2021, it should return Mon 13/09/2021', () => {
      const monday = getMonday(new Date('2021-09-13T06:35:54.759Z'))
      expect(monday.toISOString()).toBe('2021-09-13T06:35:54.759Z')
    })
    it('Wed 01/09/2021, it should return Mon 30/08/2021', () => {
      const monday = getMonday(new Date('2021-09-01T06:35:54.759Z'))
      expect(monday.toISOString()).toBe('2021-08-30T06:35:54.759Z')
    })
    it('Difference in year: Fri 01/01/2021, it should return Mon 28/12/2020', () => {
      const monday = getMonday(new Date('2021-01-01T06:35:54.759Z'))
      expect(monday.toISOString()).toBe('2020-12-28T06:35:54.759Z')
    })
  })

  describe('getSunday', () => {
    it('Wed 15/09/2021, it should return Sun 19/09/2021', () => {
      const sunday = getSunday(new Date('2021-09-15T06:35:54.759Z'))
      expect(sunday.toISOString()).toBe('2021-09-19T06:35:54.759Z')
    })
    it('Sun 19/09/2021, it should return Sun 19/09/2021', () => {
      const sunday = getSunday(new Date('2021-09-15T06:35:54.759Z'))
      expect(sunday.toISOString()).toBe('2021-09-19T06:35:54.759Z')
    })
    it('Difference in year: Mon 28/12/2020, it should return Sun 03/01/2021', () => {
      const sunday = getSunday(new Date('2020-12-28T06:35:54.759Z'))
      expect(sunday.toISOString()).toBe('2021-01-03T06:35:54.759Z')
    })
  })
})

describe('Test helpers', () => {
  describe('calculateMaxRequestedWorkingHoursPerWeek', () => {
    it('Should return 45', () => {
      const result = getTotalHours([
        {
          end: '2021-09-13T10:00:00Z',
          start: '2021-09-13T01:00:00Z',
        },
        {
          end: '2021-09-14T10:00:00Z',
          start: '2021-09-14T01:00:00Z',
        },
        {
          end: '2021-09-15T10:00:00Z',
          start: '2021-09-15T01:00:00Z',
        },
        {
          end: '2021-09-16T10:00:00Z',
          start: '2021-09-16T01:00:00Z',
        },
        {
          end: '2021-09-17T10:00:00Z',
          start: '2021-09-17T01:00:00Z',
        },
      ])
      expect(result).toBe(45)
    })
    it('Should return 0', () => {
      const result = getTotalHours([])
      expect(result).toBe(0)
    })
  })
})

describe('getStartEndInCurrentWeek', () => {
  it('Fri 17/09/2021, start week: 13/09/2021, end week: 18/09/2021', () => {
    const result = getStartEndInCurrentWeek(new Date(2021, 8, 17))
    const { start, end } = result
    expect(start.toDateString()).toBe(new Date(2021, 8, 13).toDateString())
    expect(end.toDateString()).toBe(new Date(2021, 8, 18).toDateString())
  })
})
