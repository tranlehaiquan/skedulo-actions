import { Operator } from './types'

export const DEFAULT_PAGE_PARAMS = {
  pageSize: 20,
  pageNumber: 1
}

export const FILTER_OPERATORS = {
  CONTAINS: {
    value: Operator.Contains,
    label: 'Contains',
    formatFn: (value: string) => {
      return `LIKE '%${value}%'`
    }
  },
  STARTS_WITH: {
    value: Operator.StartsWith,
    label: 'Starts With',
    formatFn: (value: string) => {
      return `LIKE '${value}%'`
    }
  },
  EQUALS: {
    value: Operator.Equals,
    label: 'Equals',
    formatFn: (value: string) => {
      return `== '${value}'`
    }
  },
  GREATER_THAN_OR_EQUAL_TO: {
    value: Operator.GreaterThanOrEqualTo,
    label: 'Greater Than Or Equal To',
    formatFn: (value: string) => {
      return `>= ${value}`
    }
  },
  LESS_THAN_OR_EQUAL_TO: {
    value: Operator.LessThanOrEqualTo,
    label: 'Less Than Or Equal To',
    formatFn: (value: string) => {
      return `<= ${value}`
    }
  },
  INCLUDES: {
    value: Operator.Includes,
    label: 'Includes',
    formatFn: (value: string) => {
      return `INCLUDES '${value}'`
    }
  },
  IN: {
    value: Operator.In,
    label: 'In',
    formatFn: (value: string) => {
      return `IN ${value}`
    }
  }
}

export const GRAPHQL_DATE_FORMAT = 'yyyy-MM-dd'