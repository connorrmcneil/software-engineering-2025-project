/**
 * Word Audio & Game HUD Component
 *
 * A control bar that sits above the game grid. It provides the
 * primary user interaction for hearing the word, viewing the text hint,
 * and tracking game progress.
 *
 * Author: Wenda Tan
 */
import {Button, Group, Stack, Text} from '@mantine/core'

interface WordControlsProps {
  /** The text to display (usually the target word, hint, or translation) */
  displayText: string
  /** String indicating progress, formatted like "Round 1 / 3" */
  roundDisplay: string
  /** Callback function to trigger the audio file associated with the current word */
  playAudio: () => void
}

/**
 * Component: WordControls
 * Renders the horizontal toolbar containing the Audio Button, Target Text, and Round Counter.
 */
export function WordControls({displayText, roundDisplay, playAudio}: WordControlsProps) {
  return (
    <Group gap="lg" align="center">
      {/* Audio Trigger Button */}
      <Button onClick={playAudio} size="lg" color="blue">
        <Stack gap={0} align="center">
          <Text span size="lg" fw={700} lh={1.2}>
            Almila'si
          </Text>
          <Text span size="10px" fw={200} lh={1}>
            Play Audio
          </Text>
        </Stack>
      </Button>
      <Text size="xl" fw={700}>
        {displayText}
      </Text>
      <Text size="lg" fw={600}>
        {roundDisplay}
      </Text>
    </Group>
  )
}
