/// <reference types="cypress" />

/**
 * Component Tests for Footer Component
 * 
 * Author:
 * Jack Greenlaw
 */

import { Footer } from '@/components/Footer'
import { MantineProvider } from '@mantine/core'
import React from 'react'

// Ensure cy.mount typing is available in tests
declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: React.ReactNode, options?: any) => Chainable<any>
    }
  }
}

describe('<Footer />', () => {
  it('renders the icon, title, and all links', () => {
    cy.mount(
      <MantineProvider>
        <Footer />
      </MantineProvider>
    )

    // Check the main text
    cy.contains("Mikwite'tmk+t Angie").should('be.visible')

    // Check the icon exists (svg)
    cy.get('svg').should('exist')

    // Check all links are rendered correctly
    const links = [
      { link: '/faq', label: 'Frequently Asked Questions' },
      { link: '/privacypolicy', label: 'Privacy Policy' },
      { link: '/admin', label: "Nikana'tu'tite'wk" },
    ]

    links.forEach(({ link, label }) => {
      cy.contains('a', label)
        .should('have.attr', 'href', link)
        .and('be.visible')
    })
  })
})
