import { Resources } from 'shared/dist/__graphql/graphql'

interface IServiceAdapter {
  fetchResources: (filter?: string) => Promise<Resources[]>
  fetchResourceById: (id: string) => Promise<Resources>
  getReferenceUIDFromContext: () => string | undefined
  getMaxRequestedWorkingHoursPerWeek: (resourceId: string) => Promise<number>
  updateResource: (id: string, payload: Partial<Resources>) => Promise<unknown>
}

export default IServiceAdapter
