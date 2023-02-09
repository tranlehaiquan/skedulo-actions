import { Type } from 'shared'

export interface ServiceAdapter {
  searchObject: (
    objectName: string,
    searchTerm: string,
    fieldName?: string,
    limit?: number
  ) => Promise<Type.BaseObject[]>
  fetchVocabulary: (objectNames?: string[]) => Promise<Type.Vocabulary>
  fetchFieldVocabularies: (objectName: string, fieldName: string) => Promise<Type.VocabularyField[] | Type.BaseObject[]>
}

type IServiceAdapter = ServiceAdapter

export default IServiceAdapter
