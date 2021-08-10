import fetch from './shared/fetch'
import { 
  Resources
} from 'shared/dist/__graphql/graphql'

import { fetchResources as fetchFilteredResources } from './queries/commonQueries';

class SkeduloService {
  async fetchResources (filter: string) {
    try {
      // TODO: need to get all resouces - currently it only 200 as max
      const res = await fetch.graphQl<{ resources: { edges: { node: Resources }[] } }>({
        query: fetchFilteredResources,
        variables: {
          filter
        }
      })
      return res.data?.resources.edges.length ? res.data.resources.edges.map(item => item.node) : []
    } catch (error) {
      return []
    }
  }
}

export default new SkeduloService()
