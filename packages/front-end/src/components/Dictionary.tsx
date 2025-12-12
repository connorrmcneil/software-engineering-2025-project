import type {Word} from '@/types'

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Image,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {BooksIcon, MagnifyingGlassIcon, SpeakerHighIcon} from '@phosphor-icons/react'
import Fuse from 'fuse.js'
import {useRef, useState} from 'react'
import {useLoaderData} from 'react-router'

import {wordsLoader} from '@/router/words.loader'
import {toStorageUrl} from '@/utils'

export function Dictionary() {
  const {words} = useLoaderData<typeof wordsLoader>()
  const [opened, {open, close}] = useDisclosure(false)

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
  const wordCards = _words.map(word => <DictionaryCard key={word.id} word={word} />)

  return (
    <>
      <Button variant="default" onClick={open} leftSection={<BooksIcon size={20} />} h="auto" p="4px 16px">
        <Stack gap={0} align="center" p="4px">
          <Text size="sm" fw={500}>
            Kllusuwaqnn Kwilmumkl
          </Text>
          <Text size="12px" style={{opacity: 0.8}}>
            Dictionary
          </Text>
        </Stack>
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="sm">
            <Text fw="bold">Kllusuwaqnn Kwilmumkl - Dictionary</Text>
            <Badge variant="light">{words.length} words</Badge>
          </Group>
        }
        transitionProps={{transition: 'fade', duration: 200}}
        fullScreen
        centered
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack>
          <TextInput
            placeholder="Search words..."
            leftSection={<MagnifyingGlassIcon size={20} />}
            value={query}
            onChange={e => setQuery(e.currentTarget.value)}
            aria-label="Search dictionary"
          />
          <SimpleGrid cols={{xl: 6, lg: 5, md: 4, sm: 3, base: 2}}>{wordCards}</SimpleGrid>
        </Stack>
      </Modal>
    </>
  )
}

function DictionaryCard({word}: {word: Word}) {
  return (
    <Paper withBorder style={{overflow: 'hidden'}}>
      <Stack>
        <Image src={toStorageUrl(word.imagePath)} alt={word.mikmaq} fit="cover" />
        <Group p="md" justify="space-between" wrap="nowrap" align="flex-start">
          <Stack gap="xs">
            <Badge variant="light">{word.startMonth}</Badge>
            <div>
              <Text fw="bold">{word.mikmaq}</Text>
              <Text c="dimmed">{word.english}</Text>
            </div>
          </Stack>
          <AudioButton src={toStorageUrl(word.audioPath)} />
        </Group>
      </Stack>
    </Paper>
  )
}

function AudioButton({src}: {src: string}) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const onClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <>
      <Tooltip label="Listen to pronounciation">
        <ActionIcon variant="transparent" onClick={onClick}>
          <SpeakerHighIcon size={32} weight="fill" />
        </ActionIcon>
      </Tooltip>
      <audio ref={audioRef} src={src} />
    </>
  )
}
