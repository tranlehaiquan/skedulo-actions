import { ISelectItem } from '@skedulo/sked-ui'

export interface HasID {
  UID: string
}

export interface PageParams {
  pageSize: number
  pageNumber: number
}

export interface OrderParams {
  orderBy: string
  orderType: 'DESC' | 'ASC'
}

export interface FilterParams {
  filterBy: FilterableItem | null
  operator: Operator | null
  value: string
  originalValue?: any
}

export interface GraphqlVariables {
  filter: string
  orderBy?: string
  offset?: number
  first?: number
  rawParams?: Record<string, any>
}

export enum ColumnType {
  date = 'date',
  dateRange = 'dateRange',
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  time = 'time',
  datetime = 'datetime',
  picklist = 'picklist',
  multipicklist = 'multipicklist',
  reference = 'reference'
}

export enum Operator {
  Contains = 'contains',
  StartsWith = 'StartsWith',
  Equals = 'Equals',
  GreaterThanOrEqualTo = 'GreaterThanOrEqualTo',
  LessThanOrEqualTo = 'LessThanOrEqualTo',
  Between = 'Between',
  Includes = 'Includes',
  In = 'In'
}

export interface FilterOperator {
  label: string
  value: Operator
  formatFn: (value: string, originalValue?: string[]) => string
}

export interface FilterableItem extends ISelectItem<string> {
  fieldType: ColumnType
  operators: FilterOperator[]
  key: string
  fetchItems?: (searchTerm: string) => Promise<ISelectItem[]>
  items?: ISelectItem[]
  fieldName?: string
}

export interface GraphqlListResponse<T> {
  totalCount: number
  edges: Array<{
    cursor: string
    node: T
  }>
  pageInfo: {
    hasNextPage: boolean
  }
}

export interface TransformedListResponse<T> {
  data: T[]
  hasNextPage?: boolean
  totalCount: number
}
