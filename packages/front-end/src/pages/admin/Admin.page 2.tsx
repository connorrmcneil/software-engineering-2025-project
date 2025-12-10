import type {adminLoader} from '@/router/admin.loader'
import type {Word} from '@/types'
import type {ModalProps, TableData} from '@mantine/core'

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Menu,
  Modal,
  Paper,
  Table,
  Text,
  TextInput
} from '@mantine/core'
import {
  ArrowLeftIcon,
  DotsThreeCircleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  SignOutIcon,
  TrashIcon
} from '@phosphor-icons/react'
import Fuse from 'fuse.js'
import {useState} from 'react'
import {Link, useLoaderData, useRevalidator} from 'react-router'

import {api} from '@/api'
import AudioButton from '@/components/AudioButton'
import ImageButton from '@/components/ImageButton'
import {toStorageUrl} from '@/utils'
import {CreateWordModal} from './CreateWord.modal'
import {UpdateWordModal} from './UpdateWord.modal'
import {useModalWithTarget} from './use-modal-with-target'

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

  const createModal = useModalWithTarget<null>()
  const editModal = useModalWithTarget<Word>()
  const deleteModal = useModalWithTarget<Word>()

  const table: TableData = {
    head: ["Mi'kmaq", 'English', 'Starts in', 'Image', 'Audio', 'Created', ''],
    body: _words.map(word => [
      word.mikmaq,
      word.english,
      <Badge variant="light">{word.startMonth}</Badge>,
      <ImageButton variant="subtle" key={word.id} src={toStorageUrl(word.imagePath)} />,
      <AudioButton variant="subtle" key={word.id} src={toStorageUrl(word.audioPath)} />,
      <Badge variant="light" c="green">
        {new Date(word.createdAt).toLocaleDateString()}
      </Badge>,
      <Menu>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <DotsThreeCircleIcon size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<PencilIcon size={16} />} onClick={() => editModal.open(word)}>
            Edit word
          </Menu.Item>
          <Menu.Item color="red" leftSection={<TrashIcon size={16} />} onClick={() => deleteModal.open(word)}>
            Delete word
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ])
  }

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
            <Button leftSection={<PlusIcon size={16} />} onClick={() => createModal.open()}>
              Add word
            </Button>
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
      <CreateWordModal opened={createModal.opened} onClose={createModal.close} />
      {editModal.target && (
        <UpdateWordModal opened={editModal.opened} onClose={editModal.close} word={editModal.target} />
      )}
      {deleteModal.target && (
        <DeleteWordModal opened={deleteModal.opened} onClose={deleteModal.close} word={deleteModal.target} />
      )}
    </div>
  )
}

function DeleteWordModal({onClose, word, ...props}: ModalProps & {word: Word}) {
  const {revalidate} = useRevalidator()
  const onDelete = async () => {
    await api.delete(`/words/${word.id}`)
    revalidate()
    onClose()
  }

  const [confirmed, setConfirmed] = useState(false)

  return (
    <Modal title="Delete word" closeOnClickOutside={false} closeOnEscape={false} onClose={onClose} {...props}>
      <Text mb="sm">
        Are you sure you want to delete word&nbsp;
        <Text span c="blue">
          {word.mikmaq}
        </Text>
        ?
      </Text>
      <Checkbox
        checked={confirmed}
        onChange={e => setConfirmed(e.currentTarget.checked)}
        label="I understand that this action cannot be reversed."
      />
      <Group mt="xl" justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onDelete} disabled={!confirmed}>
          Delete word
        </Button>
      </Group>
    </Modal>
  )
}
