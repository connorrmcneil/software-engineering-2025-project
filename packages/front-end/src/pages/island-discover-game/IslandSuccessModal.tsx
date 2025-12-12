import {Button, Modal, Stack, Text, Title} from '@mantine/core'

interface IslandSuccessModalProps {
  opened: boolean
  onNext: () => void
}

export function IslandSuccessModal({opened, onNext}: IslandSuccessModalProps) {
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
          Si'owa'si
        </Button>
      </Stack>
    </Modal>
  )
}
