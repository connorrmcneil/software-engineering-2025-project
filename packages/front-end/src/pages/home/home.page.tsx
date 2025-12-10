/**
 * Purpose: Homepage component
 * 
 * Made with Mantine's "Hero with bullets" from the "Hero headers" category
 * 
 * Author: Alison Cook
 */
import { Button, Container, Group, Image, List, Stack, Text, Title } from '@mantine/core'
import { useMemo, useState } from 'react'

import character1Dance from '@/assets/images/characters/character1-dance.png'
import character2Dance from '@/assets/images/characters/character2-dance.png'
import { GameSelectionModal } from '@/components/GameSelection'
import classes from '@/styles/home.module.css'

/**
 * Purpose: Renders the home/landing page with title, description, feature list, 
 * and play button
 * 
 * Parameters: None
 */
export function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  
  /**
   * Purpose: Randomly selects character 1 or 2 to be shown on the landing page
   */
  const randomCharacter = useMemo(() => {
    return Math.random() > 0.5 ? character1Dance : character2Dance
  }, [])

  return (
    <Container size="xl">
      <GameSelectionModal opened={modalOpen} onClose={() => setModalOpen(false)} />
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Ekina'masimk <span className={classes.highlight}>L'nui'simk</span>
          </Title>
          <Text c="dimmed" mt="md">
            Learning the Mi'kmaw language
          </Text>

          <List mt={30} spacing="sm" size="sm">
            <List.Item>
              <b>Toqatu elatikl klusuaqn aqq napwi'kaqn</b> – match words to pictures
            </List.Item>
            <List.Item>
              <b>Kina'masi teli aknutmamk aqq waisisk</b> – learn conversational words and animals
            </List.Item>
            <List.Item>
              <b>Nuji-kina'muet kisi ankui-ika'tutaq klusuwaqnn</b> – teachers can add new words
            </List.Item>
          </List>

          <Group mt={30}>
            <Button onClick={() => setModalOpen(true)} radius="xl" size="md" className={classes.control}>
              <Stack gap={0} align="center">
                <Text span fw={700} lh={1.2}>
                  Almila'si
                </Text>
                <Text span size="10px" fw={200} lh={1}>
                  Play
                </Text>
              </Stack>
            </Button>
          </Group>
        </div>
        <Image src={randomCharacter} className={classes.image} />
      </div>
    </Container>
  )
}
