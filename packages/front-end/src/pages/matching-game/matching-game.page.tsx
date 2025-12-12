/**
 * Word Match Game Container
 *
 * The main controller for the matching game. It handles:
 * 1. Loading word data from the router.
 * 2. Organizing words by Month.
 * 3. Managing the complex game state (Current round, score, wrong attempts).
 * 4. Generating the randomized 3x3 grid for each round.
 * 5. Rendering the UI and handling user interaction.
 *
 * Author(s):
 * - Last year's Authors
 * - Wenda Tan
 */

import type {Month, Word} from '@/types'

import {BackgroundImage, Box, Paper, Select, SimpleGrid, Stack, Text, Title} from '@mantine/core'
import {useEffect, useMemo, useReducer, useState} from 'react'
import {useLoaderData} from 'react-router'

import MatchingGameBackground from '@/assets/images/items/MatchingGameBackground.jpeg'
import {wordsLoader} from '@/router/words.loader'
import {toStorageUrl} from '@/utils'
import {CorrectAnswerModal} from './CorrectAnswerModal'
import {GameEndPopup} from './GameEndPopup'
import {ScoreBeads} from './ScoreBeads'
import {WordControls} from './WordControls'
import {WordGrid} from './WordGrid'
import {WrongAnswerModal} from './WrongAnswerModal'

/**
 * GameState: The single source of truth for the game's current status.
 */
type GameState = {
  index: number // Current level/word index (0 to totalWords - 1)
  initWords: Word[] // The shuffled list of words for the selected month
  boxes: Word[] // The 9 items currently displayed in the grid
  displayText: string // The target word (Mik'maq) shown to the user
  displayImage: string // The correct image path (used for validation)
  displayAudio: string // The correct audio path
  successCount: number // How many levels passed successfully
  gameEnd: boolean // True if all words in the month are completed
  wrongAttempts: number // 0 = fresh, 1 = warning shown
  showWrongModal: boolean // Controls visibility of the "Try Again" modal
  showSecondModal: boolean // Controls visibility of the "Game Over" modal
  showSuccessModal: boolean // Controls visibility of the "Correct Answer" modal
  initialized: boolean // Prevents regeneration during renders
}

// Used for translated months
const MONTH_TRANSLATIONS: Record<string, string> = {
  September: "Wikumkewiku's",
  October: "Wikewiku's",
  November: "Keptekewiku's",
  December: "Kesikewiku's",
  January: "Punamujuiku's",
  February: 'Apuknajit',
  March: "Si'ko'ku's"
}

/**
 * GameAction: All possible events that can change the state.
 */
type GameAction =
  | {type: 'SET_INIT'; words: Word[]} // Load a new month of words
  | {type: 'GENERATE'} // Build the grid for the current round
  | {type: 'SELECT'; selectedImage: string} // Player clicked an image
  | {type: 'TRY_AGAIN'} // Player closed the warning modal
  | {type: 'RESTART'} // Player chose to restart the specific level
  | {type: 'NEW_GAME'} // Player chose to restart the whole month
  | {type: 'NEXT_WORD'} // Player chose to proceed to the next word

const initialState: GameState = {
  index: 0,
  initWords: [],
  boxes: [],
  displayText: '',
  displayImage: '',
  displayAudio: '',
  successCount: 0,
  gameEnd: false,
  wrongAttempts: 0,
  showWrongModal: false,
  showSecondModal: false,
  showSuccessModal: false,
  initialized: false
}

export function WordMatchGame() {
  // Load all words from the router context
  const {words} = useLoaderData<typeof wordsLoader>()

  /**
   * Group words by Month for the dropdown selector.
   * Uses useMemo so we don't recalculate this huge object on every render.
   */
  const wordsByMonth = useMemo(() => {
    return words.reduce(
      (acc, word) => {
        if (!acc[word.startMonth]) {
          acc[word.startMonth] = []
        }
        acc[word.startMonth].push(word)
        return acc
      },
      {} as Record<Month, Word[]>
    )
  }, [words])

  const [selectedMonth, setSelectedMonth] = useState<Month>('September')

  /**
   * Generates the 3x3 grid layout (9 slots total).
   * Logic:
   * 1. Identify the Correct Word (Target).
   * 2. Calculate how many "Blank" panels are needed (Total 9 slots).
   * 3. Pick random "Distractor" words from the remaining list.
   * 4. Shuffle everything together.
   *
   * This will most likely have to be changed in the future to account for x words per month.**
   */
  const generateGrid = (initWords: Word[], index: number) => {
    if (!initWords || initWords.length === 0) return null

    const fixedWord = initWords[index]
    let inactivePanelCount = 0
    const wordCount = initWords.length
    // Determine blanks based on available words to ensure grid isn't too crowded or empty
    if (wordCount === 3) inactivePanelCount = 6
    else if (wordCount === 6) inactivePanelCount = 3

    const otherWords = initWords.filter(w => w.mikmaq !== fixedWord.mikmaq)

    const shuffledGrid = [...otherWords, ...Array(inactivePanelCount).fill(null)]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)

    // Combine Answer + 8 Random items and shuffle again
    const grid = [fixedWord, ...shuffledGrid].sort(() => Math.random() - 0.5)

    return {
      boxes: grid,
      displayText: fixedWord.mikmaq,
      displayImage: fixedWord.imagePath,
      displayAudio: fixedWord.audioPath
    }
  }

  function reducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
      case 'SET_INIT': {
        // Reset everything when a new month is selected
        return {
          ...state,
          initWords: action.words,
          index: 0,
          successCount: 0,
          wrongAttempts: 0,
          gameEnd: false,
          initialized: false,
          showWrongModal: false,
          showSecondModal: false
        }
      }
      case 'GENERATE': {
        // Create the grid visuals for the current level
        const payload = generateGrid(state.initWords, state.index)
        if (!payload) return state
        return {
          ...state,
          boxes: payload.boxes,
          displayText: payload.displayText,
          displayImage: payload.displayImage,
          displayAudio: payload.displayAudio,
          initialized: true
        }
      }
      case 'SELECT': {
        // Validation Logic
        const isCorrect = action.selectedImage === state.displayImage
        if (isCorrect) {
          return {
            ...state,
            successCount: state.successCount + 1, // Update beads
            wrongAttempts: 0,
            showSuccessModal: true
          }
        }
        // incorrect
        if (state.wrongAttempts === 0) {
          return {...state, showWrongModal: true, wrongAttempts: 1}
        }

        return {...state, showSecondModal: true}
      }
      case 'NEXT_WORD': {
        const nextIndex = state.index + 1
        const gameEnd = nextIndex >= state.initWords.length

        return {
          ...state,
          showSuccessModal: false, // Close modal
          index: nextIndex, // Move to next word
          gameEnd: gameEnd,
          initialized: false // Trigger regeneration
        }
      }
      case 'TRY_AGAIN':
        // Close warning modal
        return {...state, showWrongModal: false}
      case 'RESTART':
        // Reset the current level (used after failing twice)
        return {...state, showSecondModal: false, index: 0, successCount: 0, wrongAttempts: 0}
      case 'NEW_GAME': {
        // Reshuffle and start the month over
        const reshuffled = [...state.initWords].sort(() => Math.random() - 0.5)
        return {
          ...state,
          initWords: reshuffled,
          index: 0,
          successCount: 0,
          wrongAttempts: 0,
          gameEnd: false,
          initialized: false,
          showWrongModal: false,
          showSecondModal: false
        }
      }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const wordCount = wordsByMonth[selectedMonth]?.length

  // Effect 1: Initialize game when Month changes
  useEffect(() => {
    const monthWords = wordsByMonth[selectedMonth]?.slice(0, wordCount) || []
    const randomized = [...monthWords].sort(() => Math.random() - 0.5)
    dispatch({type: 'SET_INIT', words: randomized})
  }, [wordsByMonth, selectedMonth, wordCount])

  // Effect 2: Generate Grid when words are loaded but grid is empty
  useEffect(() => {
    if (state.initWords.length > 0 && !state.initialized && !state.gameEnd) {
      dispatch({type: 'GENERATE'})
    }
  }, [state.initWords, state.initialized, state.gameEnd])

  // Effect 3: Generate Grid when moving to the next level
  useEffect(() => {
    if (state.index < state.initWords.length && !state.gameEnd && !state.initialized) {
      dispatch({type: 'GENERATE'})
    }
  }, [state.index, state.initWords.length, state.initialized, state.gameEnd])

  const handleNextWord = () => {
    dispatch({type: 'NEXT_WORD'})
  }

  // Correct/Incorrect Selection
  const handleSelection = (selectedImage: string) => {
    const isCorrect = selectedImage === state.displayImage
    if (isCorrect && state.displayAudio) new Audio(toStorageUrl(state.displayAudio)).play()
    dispatch({type: 'SELECT', selectedImage})
  }

  const handleTryAgain = () => dispatch({type: 'TRY_AGAIN'})
  const handleRestart = () => {
    dispatch({type: 'RESTART'})
    dispatch({type: 'NEW_GAME'})
  }

  const playAudio = () => {
    if (state.displayAudio) new Audio(toStorageUrl(state.displayAudio)).play()
  }

  const newGame = () => dispatch({type: 'NEW_GAME'})

  const roundDisplay = `${state.index}/${wordCount}`

  return (
    <BackgroundImage
      h="var(--app-height)"
      src={MatchingGameBackground}
      p={{base: 'xs', sm: 'md', md: 'xl'}}
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <Paper
        bg="rgba(255, 255, 255, 0.85)"
        // Responsive width: 100% on mobile, up to 1200px on desktop
        w={{base: '100%', md: 1200}}
        maw="100%"
        p={{base: 'md', md: 'xl'}}
        radius="xl"
        shadow="xl"
      >
        <Stack gap="10px" mb="lg">
          <Title order={1} ta="center" fw={1300}>
            Klusuwaqnminal
          </Title>
          <Text ta="center" c="dimmed" fs="italic">
            Word Match
          </Text>
        </Stack>

        {/* 1. Victory Popup (End of Month) */}
        <GameEndPopup opened={state.gameEnd} onNewGame={newGame} />

        <CorrectAnswerModal opened={state.showSuccessModal} onNext={handleNextWord} />

        {/* 2. Warning Modal */}
        <WrongAnswerModal
          opened={state.showWrongModal}
          firstAttempt={true}
          onTryAgain={handleTryAgain}
          onRestart={handleRestart}
        />
        {/* 3. Game Over Modal */}
        <WrongAnswerModal
          opened={state.showSecondModal}
          firstAttempt={false}
          correctWord={state.initWords[state.index]?.mikmaq}
          correctImage={state.initWords[state.index]?.imagePath}
          translation={state.initWords[state.index]?.english}
          onTryAgain={handleTryAgain}
          onRestart={handleRestart}
        />

        {/* --- MAIN GAME LAYOUT --- 
            Mobile: Stack (1 column)
            Desktop: Grid (2 columns)
        */}
        <SimpleGrid cols={{base: 1, md: 2}} spacing={{base: 'lg', md: 'xl'}}>
          {/* Left */}
          <Stack justify="flex-start" gap="lg">
            <Select
              label="Select month"
              value={selectedMonth}
              onChange={value => setSelectedMonth((value as Month) || 'September')}
              data={Object.entries(wordsByMonth).map(([month]) => {
                const mikmaqName = MONTH_TRANSLATIONS[month] || month
                const shortEnglish = month.slice(0, 3)

                return {
                  value: month,
                  label: `${mikmaqName} (${shortEnglish})`
                }
              })}
              w="100%"
            />

            {/* Score Beads (Only show if player has points) */}
            <Box>
              {state.successCount > 0 && (
                <Stack align="center" gap="xs">
                  <Text size="sm" fw={500} c="dimmed">
                    Score
                  </Text>
                  <ScoreBeads score={state.successCount} />
                </Stack>
              )}
            </Box>

            {/* Use a Card look for the active word control */}
            <Paper withBorder p="md" radius="md" bg="white">
              <WordControls displayText={state.displayText} roundDisplay={roundDisplay} playAudio={playAudio} />
            </Paper>
          </Stack>

          {/* Grid */}
          <Box>
            <WordGrid words={state.boxes} handleSelection={handleSelection} />
          </Box>
        </SimpleGrid>
      </Paper>
    </BackgroundImage>
  )
}
