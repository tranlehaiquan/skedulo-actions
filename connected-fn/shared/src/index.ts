/**
 * This file should export anything that needs to be available to other projects.
 * This might include the types that are derived from queries or the generated
 * documents themselves that can be used to execute the queries.
 */

// Converted types representing data available in queries
// export { JobProduct, Product, JobProductsManagedData, JobProductsCommonData } from './custom-types'

// Documents for execution
import { DocumentNode } from "graphql"

import { fetchJobs } from "./queries/fetchJobs.graphql"

export { ShareServices } from './services/ShareServices'

const getQueryBody = (query: DocumentNode) => query?.loc?.source.body || ''

export const Queries = {
  fetchJobs: getQueryBody(fetchJobs)
};

export * as Type from './types'

export * as Constants from './constants'

export * as Utils from './utils'
