/**
 * Admin page for managing words.
 *
 * @author Sean MacDougall
 */

import type {adminLoader} from '@/router/admin.loader'
import type {ModalProps, TableData} from '@mantine/core'

import {
  Badge,
  Box,
  Button,
  Divider,
  FileInput,
  Group,
  Modal,
  Paper,
  Select,
  Table,
  Text,
  TextInput
} from '@mantine/core'
import {isNotEmpty, useForm} from '@mantine/form'
import {useDisclosure} from '@mantine/hooks'
import {ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, SignOutIcon} from '@phosphor-icons/react'
import Fuse from 'fuse.js'
import {serialize} from 'object-to-formdata'
import {useState} from 'react'
import {Link, useLoaderData, useRevalidator} from 'react-router'

import {api} from '@/api'
import AudioButton from '@/components/AudioButton'
import ImageButton from '@/components/ImageButton'
import {toStorageUrl} from '@/utils'

export function AdminPage() {
  const {user, words} = useLoaderData<typeof adminLoader>()

  // sign out button
  const {revalidate} = useRevalidator()
  const signOut = async () => {
    localStorage.removeItem('AuthToken')
    await revalidate()
  }

  const fuse = new Fuse(words, {
    keys: [
      'mikmaq',
      'english',
      {
        name: 'startMonth',
        weight: 0.5
      }
    ],
    threshold: 0.3
  })

  const [query, setQuery] = useState('')
  const _words = query.length ? fuse.search(query).map(result => result.item) : words

  const table: TableData = {
    head: ["Mi'kmaq", 'English', 'Starts in', 'Image', 'Audio', 'Created'],
    body: _words.map(word => [
      word.mikmaq,
      word.english,
      <Badge variant="light">{word.startMonth}</Badge>,
      <ImageButton variant="subtle" key={word.id} src={toStorageUrl(word.imagePath)} />,
      <AudioButton variant="subtle" key={word.id} src={toStorageUrl(word.audioPath)} />,
      <Badge variant="light" c="green">
        {new Date(word.createdAt).toLocaleDateString()}
      </Badge>
    ])
  }

  const [opened, {open, close}] = useDisclosure(false)

  return (
    <div>
      <Box p="lg">
        <Group justify="space-between">
          <Group>
            <Button component={Link} to="/" leftSection={<ArrowLeftIcon size={16} />} variant="default">
              Back to app
            </Button>
            <Text c="dimmed" size="lg" fw="bold">
              Hello, {user.name}
            </Text>
          </Group>
          <Button leftSection={<SignOutIcon size={16} />} onClick={signOut} variant="default">
            Sign out
          </Button>
        </Group>
      </Box>
      <Divider />
      <Box p="lg">
        <Group justify="space-between" mb="md">
          <TextInput
            leftSection={<MagnifyingGlassIcon size={16} />}
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.currentTarget.value)}
          />
          <div>
            <Button leftSection={<PlusIcon size={16} />} onClick={open}>
              Add word
            </Button>
            <CreateWordModal opened={opened} onClose={close} />
          </div>
        </Group>
        <Paper withBorder p="md">
          <Table.ScrollContainer minWidth={1000} maxHeight={500}>
            <Table
              data={table}
              highlightOnHover
              layout="fixed"
              styles={{thead: {backgroundColor: 'var(--mantine-color-gray-1)'}}}
            />
          </Table.ScrollContainer>
          {!_words.length && (
            <Text c="dimmed" ta="center" mt="md" size="sm">
              No words found
            </Text>
          )}
        </Paper>
      </Box>
    </div>
  )
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function CreateWordModal({onClose, ...props}: ModalProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      mikmaq: '',
      english: '',
      startMonth: '',
      image: null,
      audio: null
    },
    validate: {
      mikmaq: isNotEmpty("Mi'kmaq word is required"),
      english: isNotEmpty('English word is required'),
      startMonth: isNotEmpty('Starting month is required'),
      image: isNotEmpty('Image is required'),
      audio: isNotEmpty('Audio is required')
    }
  })

  const _onClose = () => {
    form.reset()
    onClose()
  }

  const {revalidate} = useRevalidator()
  const [failed, setFailed] = useState<boolean>(false)

  const onSubmit = async (values: typeof form.values) => {
    try {
      const data = serialize(values)
      await api.post('/words', data)
      revalidate()
      _onClose()
    } catch {
      setFailed(true)
    }
  }

  return (
    <Modal
      title="Add new word"
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
            placeholder="Upload an image"
            withAsterisk
            flex={1}
            clearable
            accept="image/*"
            key={form.key('image')}
            {...form.getInputProps('image')}
          />
          <FileInput
            label="Audio"
            placeholder="Upload an audio file"
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
            Failed to create word. Please try again.
          </Text>
        )}
        <Group mt="lg" justify="flex-end">
          <Button variant="default" onClick={_onClose}>
            Cancel
          </Button>
          <Button type="submit">Create word</Button>
        </Group>
      </form>
    </Modal>
  )
}
