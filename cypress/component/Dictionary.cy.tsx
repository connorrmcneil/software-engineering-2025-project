/// <reference types="cypress" />

/**
 * Component Tests for Dictionary Component
 * 
 * These tests verify the isolated behavior of the Dictionary component:
 * - Rendering the dictionary button
 * - Opening and closing the modal
 * - Displaying word cards with real data
 * - Search functionality
 * - Integration with MantineProvider and React Router
 * 
 * Author:
 * Jamieson
 */

import { Dictionary } from '@/components/Dictionary'
import { MantineProvider } from '@mantine/core'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

// Real words from the database seed data
const realWords = [
    { mikmaq: "Ni'n", english: 'I (personal pronoun)', startMonth: 'September' },
    { mikmaq: "Ki'l", english: 'You', startMonth: 'September' },
    { mikmaq: 'Teluisi', english: 'My name is', startMonth: 'September' },
    { mikmaq: 'Aqq', english: 'And', startMonth: 'October' },
    { mikmaq: 'Mijisi', english: 'Eat', startMonth: 'October' },
    { mikmaq: 'Wiktm', english: 'I like the taste of it', startMonth: 'October' },
    { mikmaq: 'Kesalk', english: 'I love', startMonth: 'November' },
    { mikmaq: "L'tu", english: 'Make it', startMonth: 'November' },
    { mikmaq: 'Eliey', english: 'I am going', startMonth: 'November' },
    { mikmaq: 'Nemitu', english: 'I see it', startMonth: 'December' },
    { mikmaq: 'Kesatm', english: 'I like', startMonth: 'December' },
    { mikmaq: 'Wejiey', english: 'I am coming from', startMonth: 'December' },
    { mikmaq: "Ta'ta", english: 'Dad', startMonth: 'January' },
    { mikmaq: "Kiju'", english: 'Mother / Grandmother', startMonth: 'January' },
    { mikmaq: 'Nekm', english: 'Him or her', startMonth: 'January' },
    { mikmaq: "Ala'tu", english: 'I have it', startMonth: 'February' },
    { mikmaq: 'Ula', english: 'Look at this', startMonth: 'February' },
    { mikmaq: 'Kesalul', english: 'I love you', startMonth: 'February' },
    { mikmaq: "Welta'si", english: 'I am happy', startMonth: 'March' },
    { mikmaq: 'Wen', english: 'Who', startMonth: 'March' },
    { mikmaq: 'Net', english: 'who is it', startMonth: 'March' }
]

// Add IDs and paths to match Word type structure
const wordsWithIds = realWords.map((word, index) => ({
    id: `word-${index + 1}`,
    ...word,
    imagePath: `/words/${word.mikmaq.toLowerCase()}.png`,
    audioPath: `/audio/${word.mikmaq.toLowerCase()}.mp3`
}))

// Mock the API to return real words
const mockWordsLoader = async () => {
    return { words: wordsWithIds }
}

// This line isn't really needed, just so cy.mount won't be red swiggled.
declare global {
    namespace Cypress {
        interface Chainable {
            mount: (component: React.ReactNode, options?: any) => Chainable<any>
        }
    }
}

describe('<Dictionary />', () => {
    // Helper to wrap component with router and Mantine
    const mountWithRouter = () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/',
                    element: <Dictionary />,
                    loader: mockWordsLoader
                }
            ],
            {
                initialEntries: ['/']
            }
        )

        return cy.mount(
            <MantineProvider>
                <RouterProvider router={router} />
            </MantineProvider>
        )
    }

    beforeEach(() => {
        // Mock audio play to prevent actual audio playback during tests
        cy.window().then((win) => {
            cy.stub(win.HTMLAudioElement.prototype, 'play').resolves()
        })
    })

    it('renders the dictionary button correctly', () => {
        mountWithRouter()

        // Check that the button is visible with correct text
        cy.contains('Kllusuwaqnn Kwilmumkl').should('be.visible')
    })

    it('opens modal when button is clicked', () => {
        mountWithRouter()

        // Click the dictionary button
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Verify modal opened with correct title
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')
        cy.contains('words').should('be.visible') // Badge with word count
    })

    it('is hidden when modal is closed', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('be.visible')

        // Close modal using the X button
        cy.get('.mantine-Modal-close').should('be.visible').click()

        // Verify modal is closed
        cy.contains('Kllusuwaqnn Kwilmumkl - Dictionary').should('not.exist')
    })

    it('displays word cards when modal is open', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Verify real word cards are displayed
        cy.contains("Ni'n").should('be.visible')
        cy.contains('I (personal pronoun)').should('be.visible')
        cy.contains("Ta'ta").should('be.visible')
        cy.contains('Dad').should('be.visible')
        cy.contains('Kesalul').should('be.visible')
        cy.contains('I love you').should('be.visible')
    })

    it('filters words when searching by Mik\'maq text', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Type in search box - search for "Kesalul"
        cy.get('input[placeholder="Search words..."]').type('Kesalul')

        // Verify filtered results (should show Kesalul)
        cy.contains('Kesalul').should('be.visible')
        cy.contains('I love you').should('be.visible')
        // Other words should not be visible
        cy.contains("Ni'n").should('not.exist')
        cy.contains("Ta'ta").should('not.exist')
    })

    it('filters words when searching by English text', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Type in search box - search for "Dad"
        cy.get('input[placeholder="Search words..."]').type('Dad')

        // Verify filtered results (should show Ta'ta)
        cy.contains("Ta'ta").should('be.visible')
        cy.contains('Dad').should('be.visible')
        // Other words should not be visible
        cy.contains('Kesalul').should('not.exist')
        cy.contains("Ni'n").should('not.exist')
    })

    it('filters words when searching by partial text', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Type partial search - "Kes" should match "Kesalk", "Kesatm", "Kesalul"
        cy.get('input[placeholder="Search words..."]').type('Kes')

        // Verify multiple words matching the search
        cy.contains('Kesalk').should('be.visible')
        cy.contains('Kesatm').should('be.visible')
        cy.contains('Kesalul').should('be.visible')
        // Words not matching should be filtered out
        cy.contains("Ta'ta").should('not.exist')
        cy.contains("Ni'n").should('not.exist')
    })

    it('displays correct word count in badge', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Verify badge shows correct count (21 words from real data)
        cy.contains('21 words').should('be.visible')
    })

    it('clears search when input is cleared', () => {
        mountWithRouter()

        // Open modal
        cy.contains('Kllusuwaqnn Kwilmumkl').click()

        // Type in search box
        cy.get('input[placeholder="Search words..."]').type('Dad')
        cy.contains("Ta'ta").should('be.visible')

        // Clear search
        cy.get('input[placeholder="Search words..."]').clear()

        // All words should be visible again
        cy.contains("Ni'n").should('be.visible')
        cy.contains("Ta'ta").should('be.visible')
        cy.contains('Kesalul').should('be.visible')
        cy.contains('Kesalk').should('be.visible')
    })
})
