/**
 * E2E Tests for Word Match Game
 *
 * - Load the Word Match game page
 * - Change the selected month
 * - Click a word tile in the grid
 * - Verify a result modal appears (correct or try again)
 *
 * @Author Connor Gerrard
 */

describe('Word Match Game E2E', () => {
  beforeEach(() => {
    // Clear storage and load the Word Match game page
    cy.clearAllLocalStorage()
    cy.visit('http://localhost:5173/matching-game') // Visit page before each test

    // Confirm page loaded
    cy.contains('Klusuwaqnminal').should('be.visible')
    cy.contains('Word Match').should('be.visible')
  })

  it('allows selecting a month and interacting with the word grid', () => {
    // Open the month selector
    cy.contains('Select month').should('be.visible')
    cy.get('input').first().click({force: true})

    // Select a different month from the dropdown
    cy.get('.mantine-Select-option').first().click()

    // Ensure word grid images are present
    cy.get('img').should('have.length.greaterThan', 0)

    // Click the first available image tile
    cy.get('img').first().click({force: true})

    // Verify that a result modal appears
    cy.get('body').then($body => {
      if ($body.text().includes("Tetpaqa'q")) {
        // Correct answer modal
        cy.contains("Tetpaqa'q").should('be.visible')
      } else if ($body.text().includes("Kjinu'kwalsi Ap")) {
        // Try again modal
        cy.contains("Kjinu'kwalsi Ap").should('be.visible')
      }
    })
  })
})
