/// <reference types="cypress" />

/**
 * Component Tests for IslandSuccessModal
 * 
 * * These tests verify the isolated behavior of the Success Modal component:
 * - Rendering correct content (Mik'maq text and English subtitle)
 * - Visibility logic (ensuring it hides/shows based on the 'opened' prop)
 * - Interaction (verifying the 'onNext' callback fires when clicked)
 * - Integration with MantineProvider
 * * Author:
 * Wenda Tan
 */

import React from 'react'
import { MantineProvider } from '@mantine/core'
import { IslandSuccessModal } from './IslandSuccessModal' 

// This line isn't really needed, just so cy.mount won't be red swiggled. 
declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: React.ReactNode, options?: any) => Chainable<any>
    }
  }
}

describe('<IslandSuccessModal />', () => {
  // Helper to wrap component with Mantine styles
  const mountWithProvider = (component: React.ReactNode) => {
    return cy.mount(
      <MantineProvider>
        {component}
      </MantineProvider>
    )
  }

  it('renders correctly when opened', () => {
    // Mount the modal with opened={true}
    mountWithProvider(
      <IslandSuccessModal 
        opened={true} 
        onNext={() => {}} 
      />
    )

    // Check for the Mik'maq title, English subtitle, and button
    cy.contains("Tetpaqa'q").should('be.visible')
    cy.contains("Correct!").should('be.visible')
    cy.contains("Si'owa'si").should('be.visible')
  })

  it('is hidden when opened={false}', () => {
    mountWithProvider(
      <IslandSuccessModal 
        opened={false} 
        onNext={() => {}} 
      />
    )

    // Ensure the modal content is NOT in the DOM
    cy.contains("Tetpaqa'q").should('not.exist')
  })

  it('calls onNext when the button is clicked', () => {
    // 1. Create a "spy" (a fake function that records calls)
    const onNextSpy = cy.spy().as('onNextSpy')

    mountWithProvider(
      <IslandSuccessModal 
        opened={true} 
        onNext={onNextSpy} 
      />
    )

    // 2. Click the button
    cy.contains("Si'owa'si").click()

    // 3. Verify the spy was called exactly once
    cy.get('@onNextSpy').should('have.been.calledOnce')
  })
})