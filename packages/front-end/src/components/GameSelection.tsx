/**
 * Game Selection Modal
 *
 * A modal dialog that serves as the main menu or portal, allowing
 * the user to navigate between different mini-games (Word Match and Goat Island).
 *
 * Authors: Wenda Tan
 * Edit: Alison Cook (added data-cy selector for testing)
 */

import { Button, Modal, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { Link } from 'react-router'

import islandimg from '@/assets/images/items/IslandGameDemo.png'
import wordmatchimg from '@/assets/images/items/MatchingGameDemo.png'

/**
 * Props for the main Modal component.
 * Standard modal controls: visibility state and close handler.
 */
interface GameSelectionModalProps {
  opened: boolean
  onClose: () => void
}

/**
 * Component: GameSelectionModal
 * The parent container that arranges the game options in a grid.
 */
export function GameSelectionModal({ opened, onClose }: GameSelectionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Choose a Game
        </Text>
      }
      centered
      size="lg"
      radius="lg"
    >
      {/* Layout: Uses SimpleGrid for responsiveness.
        - 1 column on mobile (base)
        - 2 columns on small screens and up (sm)
      */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {/* Word Matching Game */}
        <GameOptionCard
          to="/matching-game"
          title="Klusuwaqnminal"
          description="Words"
          color="blue"
          icon={<img src={wordmatchimg} alt="Word Match Game" style={{ width: '70%', height: '70%' }} />}
        />

        {/* Island Game */}
        <GameOptionCard
          to="/eskasoni-island-game"
          title="Te'puljwe'kati Waisisk"
          description="Goat Island Animals"
          color="green"
          icon={<img src={islandimg} alt="Island Game" style={{ width: '70%', height: '70%' }} />}
        />
      </SimpleGrid>
    </Modal>
  )
}

// --- GAME CARD MOVEMENT: Made with Google Gemini ---
interface GameOptionCardProps {
  to: string
  title: string
  description: string
  color: string
  icon: React.ReactNode
}

/**
 * Component: GameOptionCard
 * A clickable card that navigates to a specific game route.
 * * Animation Note: (Made with Google Gemini)
 * Uses inline styles and JS event listeners to create a "lift" effect on hover.
 */
function GameOptionCard({ to, title, description, color, icon }: GameOptionCardProps) {
  return (
    <Paper
      component={Link}
      to={to}
      withBorder
      p="xl"
      radius="md"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(5px)'
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
        e.currentTarget.style.borderColor = `var(--mantine-color-${color}-5)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--mantine-color-gray-3)'
      }}
    >
      <Stack align="center" gap="md">
        <ThemeIcon size={60} radius={60} variant="light" color={color}>
          {icon}
        </ThemeIcon>

        <Stack gap={2} align="center">
          <Text fw={700} size="lg">
            {title}
          </Text>
          <Text size="10px" c="dimmed" ta="center" lh={1.9}>
            {description}
          </Text>
        </Stack>

        <Button 
          data-cy={`play-button-${description.toLowerCase().replace(/\s+/g, '-')}`}
          variant="light" 
          color={color} 
          fullWidth mt="sm">
          <Stack gap={0} align="center">
            <Text span fw={700} lh={1.2}>
              Almila'si
            </Text>
            <Text span size="10px" fw={400} lh={1} style={{ opacity: 0.8 }}>
              Play
            </Text>
          </Stack>
        </Button>
      </Stack>
    </Paper>
  )
}
