/**
 * Purpose: Component tests for GameSelectionModal to verify rendering behavior and navigation
 * 
 * Tests:
 * - Modal does not render when opened prop is false
 * - Modal renders with both game choice cards when opened prop is true
 * - Clicking Word Match card navigates to /matching-game route
 * - Clicking Goat Island Animals card navigates to /eskasoni-island-game route
 * - Modal closes when the close icon is clicked
 * 
 * Author: Alison Cook
 */

/// <reference types="cypress" />

import '@/index.css'
import '@mantine/core/styles.css'

import { IslandGamePage } from '@/pages'
import { MantineProvider } from '@mantine/core'
import { mount } from 'cypress/react'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { GameSelectionModal } from '../../packages/front-end/src/components/GameSelection'

// wrapper: create router with modal as the route element
const mountWithMantineAndRouter = (ui: React.ReactElement) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: ui
      },
      {
        path: '/matching-game',
        element: <div>Placeholder for WordMatchGame</div>
      },
      {
        path: '/eskasoni-island-game',
        element: <IslandGamePage />
      }
    ],
    { initialEntries: ['/'] }
  )

  return mount(
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

describe('GameSelectionModal Component Tests', () => {
  it('Does not render when opened = false', () => {
    // Mount popup with "opened" disabled
    mountWithMantineAndRouter(<GameSelectionModal opened={false} onClose={cy.stub()} />)

    // Modal is closed, nothing on screen
    cy.contains('Choose a Game').should('not.exist')
  })

  it('Renders modal with game choices when opened = true', () => {
    // Mount popup in "open" state
    mountWithMantineAndRouter(<GameSelectionModal opened={true} onClose={cy.stub()} />)

    // Header text should display
    cy.contains('Choose a Game').should('be.visible')

    // Option for Word Match should be there
    cy.contains('Klusuwaqnminal').should('be.visible')

    // Scroll down in the modal to see the Island Game option
    cy.get('.mantine-SimpleGrid-root').scrollIntoView()

    // Option for Goat Island Animals should be there
    cy.contains("Te'puljwe'kati Waisisk").should('be.visible')
  })

  it('Navigates to Word Match game when card is clicked', () => {
    // Mount popup in "open" state
    mountWithMantineAndRouter(<GameSelectionModal opened={true} onClose={cy.stub()} />)

    // Click the Word Match card with force to bypass overlay
    cy.contains('Klusuwaqnminal').closest('a').click({ force: true })

    // Should navigate to matching-game route
    cy.contains('Placeholder for WordMatchGame').should('be.visible')

    // Modal is closed, nothing on screen
    cy.contains('Choose a Game').should('not.exist')
  })

    it('Navigates to Goat Island Animals game when card is clicked', () => {
    // Mount popup in "open" state
    mountWithMantineAndRouter(<GameSelectionModal opened={true} onClose={cy.stub()} />)

    // Click the Goat Island Animals card with force to bypass overlay
    cy.contains('Te\'puljwe\'kati Waisisk').closest('a').click({ force: true })

    // Should navigate to matching-game route
    cy.contains('Choose Your Character').should('be.visible')

    // Modal is closed, nothing on screen
    cy.contains('Choose a Game').should('not.exist')
  })

  it('Closes when the close icon is clicked', () => {
    // Wrapper toggles opened state when onClose is called
    function Wrapper() {
      const [open, setOpen] = React.useState(true)
      return <GameSelectionModal opened={open} onClose={() => setOpen(false)} />
    }

    // Mount the wrapper as the route element so the modal is controlled
    mountWithMantineAndRouter(<Wrapper />)

    // Wait for modal to render by checking the title text is visible
    cy.contains('Choose a Game').should('be.visible')

    // Click the close icon SVG specifically (force to bypass overlay timing)
    cy.get('.mantine-Modal-close').find('svg').should('be.visible').click({ force: true })

    // Modal should be removed because Wrapper sets open -> false
    cy.contains('Choose a Game').should('not.exist')
  })
})