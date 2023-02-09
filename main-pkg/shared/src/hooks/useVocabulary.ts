import { useState, useEffect } from 'react'
import { shareServices } from '../services/ShareServices'
import { Vocabulary } from '../types/index'

const useVocabulary = (objectNames?: string[]) => {
  const [isLoading, setIsLoading] = useState(false)
  const [vocabulary, setVocabulary] = useState({})

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const resp = await shareServices.fetchVocabulary(objectNames)
        setVocabulary(resp)
      } catch (error) {
        console.log('error: ', error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [objectNames])

  return [vocabulary, isLoading] as [Vocabulary, boolean]
}

export default useVocabulary
