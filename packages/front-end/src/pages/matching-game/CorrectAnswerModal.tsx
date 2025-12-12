/**
 * Correct Answer Modal Component for Matching Game
 *
 * A modal dialog that appears when the user selects the correct answer.
 * It provides positive feedback and a button to proceed to the next word.
 *
 * Author:
 * Wenda Tan
 */
import {Button, Modal, Stack, Text, Title} from '@mantine/core'

interface CorrectAnswerModalProps {
  opened: boolean
  onNext: () => void
}

export function CorrectAnswerModal({opened, onNext}: CorrectAnswerModalProps) {
  return (
    <Modal opened={opened} onClose={() => {}} withCloseButton={false} centered radius="lg" size="sm">
      <Stack align="center" gap="lg" py="md">
        <Title order={2} c="green" style={{fontSize: '2.5rem'}}>
          Tetpaqa'q
        </Title>

        <Text c="dimmed" size="sm">
          Correct!
        </Text>

        <Button onClick={onNext} color="green" size="lg" fullWidth radius="md">
          Si'owa'si - Next Word
        </Button>
      </Stack>
    </Modal>
  )
}
