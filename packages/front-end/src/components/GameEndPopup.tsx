import {Button, Flex, Group, Image, Modal, Text} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'

import PointPlaceholder from '@/assets/images/icons/terrythumbsup.jpg'

export function GameEndPopup() {
  const [opened, {open, close}] = useDisclosure(false)

  // test correct answer amount
  const correctAnswers = 5
  const totalWords = 9

  // Create an boolean array representing correct/incorrect answers
  const results = Array.from({length: totalWords}, (_, i) => i < correctAnswers)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Results"
        centered
        size="xl"
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

        <Flex justify="center" align="center" gap="md" wrap="nowrap" mb="xl">
          {/* iterate over results array, showing PointPlaceholder image for each, faded if incorrect */}
          {results.map((isCorrect, i) => (
            <div>
              <Image
                key={i}
                src={PointPlaceholder}
                alt="Correct"
                width="sm"
                height="sm"
                radius="sm"
                style={{opacity: isCorrect ? 1 : 0.3}} // faded for wrong ones
              />
            </div>
          ))}
        </Flex>

        <Group justify="flex-end">
          {/* placeholder function for reveal answers */}
          <Button color="red" fw={750} onClick={() => console.log('Reveal answers')}>
            Reveal Answers
          </Button>
          {/* placeholder function for retry */}
          <Button color="blue" fw={750} onClick={close}>
            Retry
          </Button>
        </Group>
      </Modal>

      {/* Button to open modal for testing purposes */}
      <Button variant="default" onClick={open}>
        Open modal
      </Button>
    </>
  )
}
