/* eslint-disable */
import axios, { Method } from 'axios'
import { flatMap, trim, toNumber } from 'lodash/fp'

import { DecodedJWT, decode } from './jwt'
import { GraphQlRequest, GraphQlResponse, HasId } from './interface'

interface FetchOnePageResp<T> {
  totalCount: number
  data: T[]
}

interface OnePageGraphQlResponse<T> {
  [key: string]: {
    totalCount: number
    edges: {
      node: T
    }[]
  }
}

interface PaginationVariableKey {
  orderBy: string
  offset: string
  first: string
  filter: string
}

interface QuerySetting<T, K extends keyof T = keyof T> {
  mapping: {
    [P in K]: string
  }
  orderBy: K[]
  paginationVariableKey: PaginationVariableKey
}

const getLastData = <T extends HasId>(data: T[]) => data.slice(-1)[0]
const getNextBatchData = <T extends HasId>(previousRemainingRecords: number, data: T[]) => ({
  remainingRecords: previousRemainingRecords - data.length,
  fromUID: getLastData(data),
})

export class Fetch {
  public static authorization: string = ''
  public static apiServer: string = ''

  constructor() {}

  get decodedJwt(): DecodedJWT {
    let [bearer, jwt] = Fetch.authorization.split(' ')
    return decode(jwt)
  }

  get vendor(): string {
    return this.decodedJwt?.payload?.['https://api.skedulo.com/vendor']
  }

  get isSalesforce(): Boolean {
    return this.vendor === 'salesforce'
  }

  get maxGraphQlPageLimit() {
    return 200 // this might dynamic per vendor later, who know
  }

  get maxGraphQLBatchLimit() {
    return this.isSalesforce ? 2000 : Number.POSITIVE_INFINITY
  }

  async graphQl<T>(request: GraphQlRequest) {
    return await this.request<GraphQlResponse<T>>('/graphql/graphql', request, 'POST')
  }

  private async fetchOnePage<T>(query: string, responseKey: string, variables?: object): Promise<FetchOnePageResp<T>> {
    const { data: graphQlData, errors } = await this.graphQl<OnePageGraphQlResponse<T>>({ query, variables })

    if (errors) {
      console.log(JSON.stringify(errors))
      throw errors
    }

    const {
      [responseKey]: { totalCount = 0, edges: data = [] },
    } = graphQlData

    return {
      totalCount,
      data: data.map(({ node }) => node),
    }
  }

  private async graphQlFromRecordBatchRequest<T extends HasId>(
    query: string,
    responseKey: string,
    variables: Record<string, string> = {},
    remainingRecords: number,
    fromItem: T,
    querySetting?: QuerySetting<T>
  ) {
    const filterKey = querySetting?.paginationVariableKey?.filter || 'filter'
    const offsetKey = querySetting?.paginationVariableKey?.offset || 'offset'
    const orderByKey = querySetting?.paginationVariableKey?.orderBy || 'orderBy'
    const orderBy = querySetting?.orderBy ?? ['UID']
    const curentFilterValue = trim(variables[filterKey] || '')
    const fromItemFilter = orderBy.reduce<{
      filter: string[]
      equalFilter: string
    }>(
      (previous, key) => {
        const lastNodeValue = `${JSON.stringify(fromItem[key])}`
        const dbKey = querySetting?.mapping?.[key] || key

        if (!previous.equalFilter) {
          return {
            filter: [`${dbKey} > ${lastNodeValue}`],
            equalFilter: `${dbKey} == ${lastNodeValue}`,
          }
        }
        return {
          filter: [...previous.filter, [previous.equalFilter, `${dbKey} > ${lastNodeValue}`].join(' AND ')],
          equalFilter: [previous.equalFilter, `${dbKey} == ${lastNodeValue}`].join(' AND '),
        }
      },
      {
        filter: [],
        equalFilter: '',
      }
    )
    const appendFilterValue = [
      fromItemFilter.filter.map((val) => `(${val})`).join(' OR ') || `UID > ${JSON.stringify(fromItem.UID)}`,
      curentFilterValue,
    ]
      .filter((val) => !!val)
      .map((val) => `(${val})`)
      .join(' AND ')
    const maxRecordLoad = Math.min(remainingRecords, this.maxGraphQLBatchLimit)
    const numberOfPage = Math.ceil(maxRecordLoad / this.maxGraphQlPageLimit)

    return flatMap(
      ({ data }) => data,
      await Promise.all(
        [...new Array(numberOfPage)].map((item, index) =>
          this.fetchOnePage<T>(query, responseKey, {
            ...variables,
            [filterKey]: appendFilterValue,
            [offsetKey]: index * this.maxGraphQlPageLimit,
            [orderByKey]: orderBy.join(',') || 'UID',
          })
        )
      )
    )
  }

  private async autoPaginationGraphqlForSalesforce<T extends HasId>(
    query: string,
    responseKey: string,
    variables: Record<string, string> = {},
    querySetting?: QuerySetting<T>
  ) {
    const firstKey = querySetting?.paginationVariableKey?.first || 'first'
    const offsetKey = querySetting?.paginationVariableKey?.offset || 'offset'
    const orderByKey = querySetting?.paginationVariableKey?.orderBy || 'orderBy'

    let resultData: T[] = []
    const { totalCount, data: firstPageDatas } = await this.fetchOnePage<T>(query, responseKey, {
      ...variables,
      // this solution will force use to overide these key
      [offsetKey]: 0,
      [orderByKey]: (querySetting?.orderBy ?? ['UID']).map((key) => querySetting?.mapping?.[key] || key).join(','),
      [firstKey]: this.maxGraphQlPageLimit,
    })

    if (totalCount === undefined) {
      throw new Error('missing total count in query')
    }
    let { remainingRecords, fromUID } = getNextBatchData(totalCount, firstPageDatas)
    resultData = firstPageDatas

    while (remainingRecords > 0 && fromUID) {
      // eslint-disable-next-line no-await-in-loop
      const currentBatchData = await this.graphQlFromRecordBatchRequest<T>(
        query,
        responseKey,
        variables,
        remainingRecords,
        fromUID,
        querySetting
      )

      ;({ remainingRecords, fromUID } = getNextBatchData(remainingRecords, currentBatchData))
      resultData = [...resultData, ...currentBatchData]
    }

    return resultData
  }

  private async autoPaginationGraphqlRequestSkedulo<T>(
    query: string,
    responseKey: string,
    variables: Record<string, string> = {},
    querySetting?: QuerySetting<T>
  ): Promise<T[]> {
    const firstKey = querySetting?.paginationVariableKey?.first || 'first'
    const offsetKey = querySetting?.paginationVariableKey?.offset || 'offset'
    const orderByKey = querySetting?.paginationVariableKey?.orderBy || 'orderBy'
    const initVariable = {
      [offsetKey]: 0,
      [orderByKey]: (querySetting?.orderBy ?? []).map((key) => querySetting?.mapping?.[key] || key).join(',') || 'UID',
      // offset and orderBy can be overide by variables
      ...variables,
      [firstKey]: this.maxGraphQlPageLimit,
      // but first will all need to set to MAX to ensure fewer call
    }
    const defaultOffSet: number = toNumber(initVariable[offsetKey] || 0)

    const { totalCount, data: firstPageDatas } = await this.fetchOnePage<T>(query, responseKey, initVariable)

    if (totalCount === undefined) {
      throw new Error('missing total count in query')
    }

    // parallel load all subsequence page
    const remainingPage = Math.max(Math.ceil((totalCount - defaultOffSet) / this.maxGraphQlPageLimit) - 1, 0)
    const subsequenceData = flatMap(
      ({ data }) => data,
      await Promise.all(
        [...new Array(remainingPage)].map((item, index) =>
          this.fetchOnePage<T>(query, responseKey, {
            ...initVariable,
            [offsetKey]: defaultOffSet + (index + 1) * this.maxGraphQlPageLimit,
          })
        )
      )
    )

    return [...firstPageDatas, ...subsequenceData]
  }

  async autoPaginationGraphqlRequest<T extends HasId>(
    query: string,
    responseKey: string,
    variables: Record<string, string> = {},
    QuerySetting?: QuerySetting<T>
  ): Promise<T[]> {
    if (this.isSalesforce) {
      return this.autoPaginationGraphqlForSalesforce<T>(query, responseKey, variables, QuerySetting)
    }
    return this.autoPaginationGraphqlRequestSkedulo<T>(query, responseKey, variables, QuerySetting)
  }

  async batchGraphQl(requests: GraphQlRequest[]) {
    return this.request<GraphQlResponse[]>('/graphql/graphql/batch', requests, 'POST')
  }

  post(url: string, body: object) {
    return this.request(url, body, 'POST')
  }

  get(url: string) {
    return this.request(url, {}, 'GET')
  }

  private request = async <T = any>(url: string, body: object, method: Method) => {
    try {
      const res = await axios({
        url: `${Fetch.apiServer}${url}`,
        method,
        headers: {
          Authorization: Fetch.authorization,
          'Content-Type': 'application/json',
        },
        data: method !== 'GET' ? body : undefined,
      })
      return res.data as T
    } catch (err) {
      throw err
    }
  }
}

export default new Fetch()
