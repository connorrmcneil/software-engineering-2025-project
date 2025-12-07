/**
 * Island Game Data Configuration
 *
 * Description: This file acts as the central database for the Goat Island game.
 * It serves three main purposes:
 * 1. Imports all necessary image assets (sprites and map backgrounds).
 * 2. Defines the dictionary of Animals (English -> Mik'maq).
 * 3. Configures the Level Progression (assigning maps, targets, and coordinates).
 *
 * Author: Wenda Tan
 */

// Animal Sprites (Used for Quiz Options and Victory Reveals)
import amaljikwej from '@/assets/images/island_game/animals/amaljikwej.png'
import aplikmuj from '@/assets/images/island_game/animals/aplikmuj.png'
import kopit from '@/assets/images/island_game/animals/kopit.png'
import lentuk from '@/assets/images/island_game/animals/lentuk.png'
import muin from '@/assets/images/island_game/animals/muin.png'
import tiam from '@/assets/images/island_game/animals/tiam.png'
import wowkwis from '@/assets/images/island_game/animals/wowkwis.png'

// Map Background Sections (Used as the game board)
import island1 from '@/assets/images/island_game/map/island_1.png'
import island2 from '@/assets/images/island_game/map/island_2.png'
import island3 from '@/assets/images/island_game/map/island_3.png'
import island4 from '@/assets/images/island_game/map/island_4.png'
import island5 from '@/assets/images/island_game/map/island_5.png'
import island6 from '@/assets/images/island_game/map/island_6.png'
import islandFinish from '@/assets/images/island_game/map/island_finish.png'
import islandStart from '@/assets/images/island_game/map/island_start.png'

/**
 * Represents a single animal entity in the game.
 * Used for quiz options and correct answer validation.
 */
export interface Animal {
  id: string
  mikmaq: string
  english: string
  image: string
}

/**
 * The Master List of Animals.
 * Acts as the "Database" for the quiz logic.
 * Could eventually be added to the database for dynamic content management.
 */
export const ANIMALS: Animal[] = [
  { id: 'raccoon', mikmaq: 'Amaljikwej', english: 'Raccoon', image: amaljikwej },
  { id: 'rabbit', mikmaq: 'Apli\'kmuj', english: 'Rabbit', image: aplikmuj },
  { id: 'beaver', mikmaq: 'Kopit', english: 'Beaver', image: kopit },
  { id: 'deer', mikmaq: 'Lentuk', english: 'Deer', image: lentuk },
  { id: 'bear', mikmaq: 'Muin', english: 'Bear', image: muin },
  { id: 'moose', mikmaq: 'Tia\'m', english: 'Moose', image: tiam },
  { id: 'fox', mikmaq: 'Wowkwis', english: 'Fox', image: wowkwis },
]

/**
 * Defines the setup for a specific stage of the game.
 */
export interface Level {
  levelId: number
  mapImage: string
  targetAnimal: Animal
  // These coordinates determine where the Boy/Girl stands on the map
  characterPos: { top: string; left: string }
}

/**
 * Game Level Configuration.
 * Controls the order of the game. As the user completes a level,
 * the app advances to the next index in this array.
 */
export const GAME_LEVELS: Level[] = [
  {
    levelId: 0,
    mapImage: islandStart,
    targetAnimal: ANIMALS[0], // Raccoon
    characterPos: { top: '45%', left: '22%' }
  },
  {
    levelId: 1,
    mapImage: island1,
    targetAnimal: ANIMALS[1], // Rabbit
    characterPos: { top: '65%', left: '22%' }
  },
  {
    levelId: 2,
    mapImage: island2,
    targetAnimal: ANIMALS[2], // Beaver
    characterPos: { top: '42%', left: '35%' }
  },
  {
    levelId: 3,
    mapImage: island3,
    targetAnimal: ANIMALS[3], // Deer
    characterPos: { top: '50%', left: '50%' }
  },
  {
    levelId: 4,
    mapImage: island4,
    targetAnimal: ANIMALS[4], // Bear
    characterPos: { top: '30%', left: '80%' }
  },
  {
    levelId: 5,
    mapImage: island5,
    targetAnimal: ANIMALS[5], // Moose
    characterPos: { top: '55%', left: '75%' }
  },
  {
    levelId: 6,
    mapImage: island6,
    targetAnimal: ANIMALS[6], // Fox
    characterPos: { top: '55%', left: '72%' }
  }
]

// The standalone background for the Victory Screen
export const FINISH_MAP = islandFinish