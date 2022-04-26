import useSWR from 'swr'

import appServices from '../services/appServices'

const useFieldVocabularies = (objectName: string, objectField: string) => {
  const { data: vocabularies, status: currentVocabulariesStatus } = useSWR(
    [`vocabularies?names=${objectName}&field=${objectField}`],
    async () => await appServices.fetchFieldVocabularies(objectName, objectField)
  )

  return {
    currentVocabulariesStatus,
    vocabularies,
  }
}

export default useFieldVocabularies
