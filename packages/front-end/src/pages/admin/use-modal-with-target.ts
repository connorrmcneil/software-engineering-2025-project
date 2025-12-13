/**
 * Custom hook to manage modal state with an associated target value.
 *
 * @author Sean MacDougall
 */

import {useDisclosure} from '@mantine/hooks'
import {useState} from 'react'

export const useModalWithTarget = <T>() => {
  const [target, setTarget] = useState<T | null>(null)
  const [opened, handlers] = useDisclosure(false)

  const open = (value: T | null = null) => {
    setTarget(value)
    handlers.open()
  }

  const close = () => {
    setTarget(null)
    handlers.close()
  }

  return {opened, target, open, close}
}
