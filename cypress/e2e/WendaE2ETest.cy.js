/**
 * E2E Tests for Goat Island Game
 * 
 * These tests cover the main user flows of the Goat Island Game, including:
 * - Character selection
 * - Completing Level 1 successfully
 * - Handling wrong answers
 * - Local storage persistence for character choice
 * 
 * Author:
 * Wenda Tan
 */

describe('Goat Island Game E2E', () => {
  beforeEach(() => {
    // 1. Clear local storage to ensure we always start at the "Select Character" 
    // screen and then go to corresponding game page. 
    cy.clearAllLocalStorage()
    cy.visit('http://localhost:5173/eskasoni-island-game') 
  })

  it('allowing user to select character', () => {
    // Check if we are on the selection screen and click "boy" image since buttons have same text
    cy.contains('Choose Your Character').should('be.visible')
    cy.get('img[src*="boy"]').click()

    // Confirm game has loaded
    cy.contains('Te\'puljwe\'kati Waisisk').should('be.visible')
    cy.contains('Level 1').should('be.visible')
  })

  it('completes Level 1 successfully', () => {
    // Select character to start game
    cy.contains('Choose Your Character')
    cy.get('img[src*="boy"]').click()

    // Find the character on the map and click to open quiz
    cy.get('img[src*="boy"]').should('be.visible').click({ force: true })

    // 1. Verify Quiz Modal is open, target is Raccoon (Amaljikwej)
    cy.contains('Taluisit wla waisis: Amaljikwej?').should('be.visible')

    // 2. Click the CORRECT answer
    // Even though options are randomized, we know the correct answer image 
    // for Level 1 is 'amaljikwej.png'. We search for that specific image.
    cy.get('img[src*="amaljikwej"]').click()

    // 1. Verify Success Modal appears
    cy.contains('Tetpaqa\'q').should('be.visible') // "Correct!"
    
    // 2. Click "Next Level" (Si'owa'si)
    cy.contains('Si\'owa\'si').click()

    // Verify we are now on Level 2
    cy.contains('Level 2').should('be.visible')
  })

  it('handles wrong answers correctly', () => {
    // Start game
    cy.get('img[src*="boy"]').click()

    // Open quiz
    cy.get('img[src*="boy"]').click()

    // Click a wrong answer
    // We find all images in the quiz modal, filter OUT the correct one, and click the first wrong one.
    cy.get('.mantine-Modal-body img')
      .not('[src*="amaljikwej"]') // Exclude the raccoon
      .first()
      .click()

    // Verify "Try Again" text appears
    cy.contains("Kjinu'kwalsi Ap").should('be.visible')
  })

  it('testing local storage for character choice', () => {
    // Select Girl this time
    cy.get('img[src*="girl"]').click()
    cy.contains('Level 1').should('be.visible')

    // Reload the page
    cy.reload()

    // Should skip selection screen and go straight to game since character is in local storage
    cy.contains('Choose Your Character').should('not.exist')
    cy.contains('Level 1').should('be.visible')
  })
})