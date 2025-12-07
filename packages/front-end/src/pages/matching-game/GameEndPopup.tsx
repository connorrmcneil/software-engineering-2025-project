import { Button, Flex, Group, Image, Modal, Text } from '@mantine/core'

import PointPlaceholder from '@/assets/images/icons/pointPlaceholder.jpg'

/**
 * End of word-match game popup including amount of points earned
 * and an option to retry or reveal answers. Component includes functionality
 * for more than 3 words/answers, we were limited to 3 for this project unfortunately.
 *
 * @Author Connor Gerrard - 2025
 */

type GameEndPopupProps = {
  opened: boolean
  onNewGame: () => void
}

export function GameEndPopup({ opened, onNewGame }: GameEndPopupProps) {
  // Only allowed 3 words this year so these values are static
  const correctAnswers = 3
  const totalWords = 3

  // Create an boolean array representing correct/incorrect answers
  const results = Array.from({ length: totalWords }, (_, i) => i < correctAnswers)

  return (
    <>
      <Modal
        opened={opened}
        onClose={onNewGame}
        title="Kelulktelatekn"
        centered
        withCloseButton={false}
        size="lg"
        styles={{
          content: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '1rem',
            padding: '2rem'
          },
          header: {
            background: 'transparent',
            color: 'white'
          },
          title: {
            fontWeight: 700,
            fontSize: '1.5rem'
          }
        }}
      >
        <Text mb="md" size="lg" fw={700}>
          You got {correctAnswers} out of {totalWords} correct.
        </Text>

        <Flex justify="left" align="center" gap="md" wrap="nowrap" mb="xl">
          {/* iterate over results array, showing PointPlaceholder image for each, faded if incorrect */}
          {results.map((isCorrect, i) => (
            <div>
              <Image
                key={i}
                src={PointPlaceholder}
                alt="Correct"
                width="s"
                height="s"
                radius="s"
                style={{ opacity: isCorrect ? 1 : 0.3 }} // faded for wrong ones
              />
            </div>
          ))}
        </Flex>

        <Group justify="flex-end">
          <Button color="blue" fw={750} onClick={onNewGame}>
            Si'owa'si - New Game
          </Button>
        </Group>
      </Modal>
    </>
  )
}
