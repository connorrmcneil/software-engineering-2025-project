/**
 * E2E Tests for Dictionary Component
 * 
 * These tests cover the main user flows of the Dictionary feature, including:
 * - Opening the dictionary modal from the header
 * - Searching for words in the dictionary
 * - Closing the dictionary modal
 * 
 * Author:
 * Jamieson
 */

describe('Dictionary E2E', () => {
    beforeEach(() => {
        // Visit the home page before each test
        cy.visit('http://localhost:5173/')
    })

    it('should open dictionary modal from header button', () => {
        // Check that the dictionary button in header is visible
        cy.contains('Kllusuwaqnn Kwilmumkl').should('be.visible')

        // Click the dictionary button in the header
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Verify the modal opened with correct title
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')

        // Verify search input is visible
        cy.get('input[placeholder="Search words..."]').should('be.visible')
    })

    it('should filter words when searching by Mik\'maq text', () => {
        // Open the dictionary modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Wait for modal to open
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')

        // Type in the search box - search for "Kesalul" (I love you)
        cy.get('input[placeholder="Search words..."]').type('Kesalul')

        // Verify search is working - should show Kesalul
        cy.contains('Kesalul').should('be.visible')
        cy.contains('I love you').should('be.visible')

        // Other words should be filtered out
        cy.contains("Ni'n").should('not.exist')
    })

    it('should filter words when searching by English text', () => {
        // Open the dictionary modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Wait for modal to open
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')

        // Type in the search box - search for "Dad"
        cy.get('input[placeholder="Search words..."]').type('Dad')

        // Verify search is working - should show Ta'ta (Dad)
        cy.contains("Ta'ta").should('be.visible')
        cy.contains('Dad').should('be.visible')

        // Other words should be filtered out
        cy.contains('Kesalul').should('not.exist')
    })

    it('should filter words when searching by partial text', () => {
        // Open the dictionary modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Wait for modal to open
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')

        // Type partial search - "Kes" should match "Kesalk", "Kesatm", "Kesalul"
        cy.get('input[placeholder="Search words..."]').type('Kes')

        // Verify multiple words matching the search
        cy.contains('Kesalk').should('be.visible')
        cy.contains('Kesatm').should('be.visible')
        cy.contains('Kesalul').should('be.visible')

        // Words not matching should be filtered out
        cy.contains("Ta'ta").should('not.exist')
    })

    it('should close dictionary modal when X button is clicked', () => {
        // Open the dictionary modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Verify modal is open
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')

        // Click the X close button in the top right corner
        // Try Mantine's close button class first
        cy.get('.mantine-Modal-close').should('be.visible').click()

        // Alternative selectors if the above doesn't work:
        // cy.get('button').contains('×').click()
        // cy.get('[aria-label="Close"]').click()
        // cy.get('button[type="button"]').last().click() // Last button is often the close button

        // Verify modal is closed
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('not.exist')
    })

    it('should display word count badge in modal title', () => {
        // Open the dictionary modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Verify the badge with word count is visible
        // Should show "20 words" or similar (total words in database)
        cy.contains('words').should('be.visible')
    })
})
