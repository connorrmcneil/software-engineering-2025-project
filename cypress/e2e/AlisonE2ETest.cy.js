/**
 * E2E Tests for Homepage
 * 
 * These tests follow the user's interaction with the homepage
 * - Press play, select, and navigate to the word match game
 * - Press play, select, and navigate to the Goat Island game
 * - Each test includes returning back to the homepage using the button in the header
 * 
 * Author: Alison Cook
 */

describe('Homepage E2E', () => {

  beforeEach(() => {
        // Visit the home page before each test
        cy.visit('http://localhost:5173')
    })

  it('plays the word match game and returns home', () => {

    // Click the main play button
    cy.contains("Almila'si").click()

    // Wait for the game selection modal to appear
    cy.contains('Choose a Game').should('be.visible')

    // Select word match
    cy.get('[data-cy="play-button-words"]').click()

    // Confirm on matching-game page
    cy.location('pathname').should('include', '/matching-game')

    // Check word match page loaded
    cy.contains('Select month').should('exist')

    // Return to the homepage
    cy.contains('Apaja\'si Nikantuk').closest('a').click({ force: true })

    // Verify we're back by checking the Play button is visible again
    cy.contains("Almila'si").should('be.visible')

    // Game selection modal is not still open
    cy.contains('Choose a Game').should('not.exist')
  })

  it('plays the Goat Island game and returns home', () => {

    // Click the main play button
    cy.contains("Almila'si").click()

    // Wait for the game selection modal to appear
    cy.contains('Choose a Game').should('be.visible')

    // Select word match
    cy.get('[data-cy="play-button-goat-island-animals"]').click()

    // Confirm on Goat Island game page
    cy.location('pathname').should('include', '/eskasoni-island-game')

    // Check that page content loaded
    // Based on what is in local storage, may choose character or change character
    cy.contains(/Choose Your Character|Change Character/).should('exist')

    // Return to the homepage
    cy.contains('Apaja\'si Nikantuk').closest('a').click({ force: true })

    // Verify we're back by checking the Play button is visible again
    cy.contains("Almila'si").should('be.visible')

    // Game selection modal is not still open
    cy.contains('Choose a Game').should('not.exist')
  })
});