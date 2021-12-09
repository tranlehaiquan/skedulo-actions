import { useState, useCallback } from 'react'

interface useConfirmationProps<T> {
  onConfirm: (params: T) => any
}

const useConfirmation = <T extends any>({ onConfirm }: useConfirmationProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [params, setParams] = useState<T | null>(null)

  const onOpen = useCallback((confirmParams: T) => {
    setParams(confirmParams)
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => setIsOpen(false), [])
  const onConfirmation = useCallback(() => {
    if (params !== null) {
      onConfirm(params)
      setIsOpen(false)
    }
  }, [params])

  return {
    isOpenConfirm: isOpen,
    onOpenConfirm: onOpen,
    onCloseConfirm: onClose,
    onConfirm: onConfirmation,
    confirmTarget: params
  }
}

export default useConfirmation
