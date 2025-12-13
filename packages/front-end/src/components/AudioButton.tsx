/**
 * AudioButton component to play audio on click.
 *
 * @author Sean MacDougall
 */

import type {ActionIconProps} from '@mantine/core'

import {ActionIcon} from '@mantine/core'
import {FileAudioIcon} from '@phosphor-icons/react'
import {useRef} from 'react'

type AudioButtonProps = {
  src: string
} & Omit<ActionIconProps, 'onClick' | 'children'>

export default function AudioButton({src, ...props}: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const onClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <>
      <ActionIcon {...props} onClick={onClick}>
        <FileAudioIcon size={16} />
      </ActionIcon>
      <audio ref={audioRef} src={src} />
    </>
  )
}
