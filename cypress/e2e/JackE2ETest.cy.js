/**
 * E2E Tests for Header & Footer
 * 
 * These tests cover the main uses of the header and footer; page navigation.
 * We verify that the header and footer page navigation buttons works as
 * desired and that the pages render properly accordingly.
 * 
 * Author:
 * Jack Greenlaw
 */


describe('Page Navigation E2E', () => {
    beforeEach(() => {
        // Visit the home page before each test
        cy.visit('http://localhost:5173')
    })

    it('Header Navigation', () => {

        // Navigate to word match
        cy.contains('Word Match').click()

        // Confirm on matching-game page
        cy.location('pathname').should('include', '/matching-game')

        // Check word match page loaded
        cy.contains('Klusuwaqnminal').should('exist')

        // Navigate to Goat Island game
        cy.contains('Goat Island Animals').click()

        // Confirm on eskasoni-island-game page
        cy.location('pathname').should('include', '/eskasoni-island-game')

        // Check goat island game loaded
        cy.contains('Choose Your Character').should('exist')

        // Navigate to Admin page
        cy.contains('Admin').click()

        //Confirm on admin page or signin page
        cy.location('pathname').should('include', '/admin')

        // Confirm admin or signin page loaded
        cy.contains('Back to app').should('exist')

        // Navigate back to home
        cy.contains('Back to app').click()

        // Confirm on home page
        cy.location('pathname').should('include', '')

        // Confirm home page loaded
        cy.contains('Learning the Mi\'kmaw language').should('exist')
    })

    it('Footer Navigation', () => {

        // Confirm footer is rendered
        cy.contains('Mikwite\'tmk+t Angie').should('exist')

        // Navigate to FAQ
        cy.contains('Frequently Asked Questions').click()

        // Confirm on FAQ page
        cy.location('pathname').should('include', '/faq')

        // Confirm FAQ loaded
        cy.contains('How do I add words as administrator.').should('exist')

        // Navigate to Privacy Policy
        cy.contains('Privacy Policy').click()

        // Confirm on FAQ page
        cy.location('pathname').should('include', '/privacypolicy')

        // Confirm FAQ loaded
        cy.contains('Last updated:').should('exist')

        // Navigate to Admin page
        cy.contains('Nikana\'tu\'tite\'wk').click()

        //Confirm on admin page or signin page
        cy.location('pathname').should('include', '/admin')

        // Confirm admin or signin page loaded
        cy.contains('Back to app').should('exist')
    })
})