/**
 * ImageButton component to display an image in a modal on click.
 *
 * @author Sean MacDougall
 */

import type {ActionIconProps} from '@mantine/core'

import {ActionIcon, Modal} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {FileImageIcon} from '@phosphor-icons/react'

type ImageButtonProps = {
  src: string
} & Omit<ActionIconProps, 'onClick' | 'children'>

export default function ImageButton({src, ...props}: ImageButtonProps) {
  const [opened, {open, close}] = useDisclosure(false)
  const title = src.split('/').pop() || 'Image'

  return (
    <>
      <ActionIcon {...props} onClick={open}>
        <FileImageIcon size={16} />
      </ActionIcon>
      <Modal title={title} opened={opened} onClose={close} size="lg">
        <img src={src} alt={src} style={{width: '100%'}} />
      </Modal>
    </>
  )
}
