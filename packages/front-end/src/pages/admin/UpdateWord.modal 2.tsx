import type {Word} from '@/types'
import type {ModalProps} from '@mantine/core'

import {Button, FileInput, Group, Modal, Select, Text, TextInput} from '@mantine/core'
import {isNotEmpty, useForm} from '@mantine/form'
import {serialize} from 'object-to-formdata'
import {useState} from 'react'
import {useRevalidator} from 'react-router'

import {api} from '@/api'
import {months} from '@/types'

export function UpdateWordModal({onClose, word, ...props}: ModalProps & {word: Word}) {
  const {id, mikmaq, english, startMonth} = word
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      mikmaq,
      english,
      startMonth,
      image: null,
      audio: null
    },
    validate: {
      mikmaq: isNotEmpty("Mi'kmaq word is required"),
      english: isNotEmpty('English word is required'),
      startMonth: isNotEmpty('Starting month is required')
    }
  })

  const {revalidate} = useRevalidator()
  const [failed, setFailed] = useState<boolean>(false)

  const _onClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (values: typeof form.values) => {
    try {
      const data = serialize(values)
      await api.patch(`/words/${id}`, data)
      revalidate()
      _onClose()
    } catch {
      setFailed(true)
    }
  }

  return (
    <Modal
      title="Update word"
      size="xl"
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={_onClose}
      {...props}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Select
          label="Starts in"
          placeholder="Month"
          data={months}
          withAsterisk
          w={150}
          mb="sm"
          key={form.key('startMonth')}
          {...form.getInputProps('startMonth')}
          searchable
        />
        <Group mb="sm" align="flex-start">
          <TextInput
            label="Mi'kmaq"
            placeholder="Word in Mi'kmaq"
            withAsterisk
            flex={1}
            key={form.key('mikmaq')}
            {...form.getInputProps('mikmaq')}
          />
          <TextInput
            label="English"
            placeholder="Word in English"
            withAsterisk
            flex={1}
            key={form.key('english')}
            {...form.getInputProps('english')}
          />
        </Group>
        <Group align="flex-start">
          <FileInput
            label="Image"
            placeholder="Upload a new image"
            withAsterisk
            flex={1}
            clearable
            accept="image/*"
            key={form.key('image')}
            {...form.getInputProps('image')}
          />
          <FileInput
            label="Audio"
            placeholder="Upload a new audio file"
            withAsterisk
            flex={1}
            clearable
            accept="audio/*"
            key={form.key('audio')}
            {...form.getInputProps('audio')}
          />
        </Group>
        {failed && (
          <Text c="red" fw="bold" mt="lg" ta="center">
            Something went wrong. Please try again.
          </Text>
        )}
        <Group mt="lg" justify="flex-end">
          <Button variant="default" onClick={_onClose}>
            Cancel
          </Button>
          <Button type="submit">Update word</Button>
        </Group>
      </form>
    </Modal>
  )
}
