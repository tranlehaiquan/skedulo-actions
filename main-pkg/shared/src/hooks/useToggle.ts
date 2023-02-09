import { useState, useCallback } from 'react'

const useToggle = (initState: boolean = false) => {
  const [state, setState] = useState(initState)

  const toggle = useCallback(() => {
    setState(prev => !prev) 
  }, [])

  const setOn = useCallback(() => setState(true), [])

  const setOff = useCallback(() => setState(false), [])

  return [state, toggle, setOn, setOff] as [boolean, () => void, () => void, () => void]
}

export default useToggle
