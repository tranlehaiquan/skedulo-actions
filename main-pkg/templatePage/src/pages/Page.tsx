import { Loading } from '@skedulo/sked-ui'
import React from 'react'

import { MainLayout } from '@/components/Layouts'
import useFieldVocabularies from '@/hooks/useFieldVocabularies'
import { FetchStatus } from '@/commons/constants'

const PatientPreferences = () => {
  const { vocabularies, currentVocabulariesStatus } = useFieldVocabularies('Jobs', 'JobStatus')
  return (
    <MainLayout>
      <div className="cx-flex cx-justify-between cx-items-center cx-mb-4">
        <h3 className="cx-text-xl cx-font-bold">Template page</h3>
      </div>

      <div>
        Load vocabulary Jobs/JobStatus
        {currentVocabulariesStatus === FetchStatus.Fetching && <Loading />}
        {currentVocabulariesStatus === FetchStatus.Fetched && (
          <pre className="cx-h-56 cx-max-w-2xl cx-overflow-y-scroll cx-border">
            {JSON.stringify(vocabularies, null, 4)}
          </pre>
        )}
      </div>
    </MainLayout>
  )
}

export default PatientPreferences
