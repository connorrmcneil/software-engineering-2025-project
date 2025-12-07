/**
 * Wrong Answer Feedback Modal
 *
 * A reusable modal that handles user feedback when an incorrect
 * option is selected. It features a two-strike system:
 * 1. First Attempt: Displays a warning to try again.
 * 2. Second Attempt: Displays the "Game Over" state, reveals the correct answer,
 * and prompts the user to restart.
 *
 * Author: Wenda Tan
 */
import { Button, Image, Modal, Stack, Text } from '@mantine/core'

import { toStorageUrl } from '@/utils'

// --- Interface Definitions ---
interface WrongAnswerModalProps {
  opened: boolean // Controls if the modal is visible
  firstAttempt: boolean // true: Show try again | false: Show game over
  correctWord?: string // The correct word to display on game over
  correctImage?: string // The correct image path to display on game over
  translation?: string // Translation of the correct word
  // Callback when user clicks "Okay" and "Start New Game"
  onTryAgain: () => void
  onRestart: () => void
}

export function WrongAnswerModal({
  opened,
  firstAttempt,
  correctWord,
  correctImage,
  translation,
  onTryAgain,
  onRestart
}: WrongAnswerModalProps) {
  return (
    // If it's just a warning, closing returns to game.
    // If it's game over, closing should restart.
    <Modal opened={opened} onClose={firstAttempt ? onTryAgain : onRestart} centered radius="lg">
      <Stack align="center" gap="md">
        {/* Branch 1: First Attempt (Warning) */}
        {firstAttempt ? (
          <>
            <Text size="lg" fw={500} color="yellow">
              Kjinu'kwalsi ap
            </Text>
            <Text size="10px" c="dimmed">
              Try Again
            </Text>
            <Button color="yellow" onClick={onTryAgain}>
              Si'owa'si
            </Button>
          </>
        ) : (
          /* Branch 2: Second Attempt (Game Over / Reveal) */
          <>
            <Text size="lg" fw={500} color="yellow">
              Kjinu'kwalsi Ap - Game Over
            </Text>

            {correctImage && (
              <Image
                src={toStorageUrl(correctImage)}
                alt={correctWord}
                w={150}
                h={150}
                fit="contain"
                radius="md"
                style={{ border: '1px solid #eee' }}
              />
            )}

            {/* Answer Reveal Text */}
            <Text size="sm" ta="center">
              Tetpaqa'q: <b>{correctWord}</b>
              <br />
              <Text span c="dimmed" size="xs">
                {translation || 'No translation available yet.'}
              </Text>
            </Text>

            <Button color="yellow" fullWidth onClick={onRestart}>
              Si'owa'si
            </Button>
          </>
        )}
      </Stack>
    </Modal>
  )
}
