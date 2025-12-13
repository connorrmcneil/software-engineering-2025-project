/// <reference types="cypress" />

/**
 * Component test for AudioButton
 * - Verifies the audio element has the provided `src`
 * - Verifies clicking the action icon triggers audio.play()
 *
 * Author: Sean MacDougall
 */

import {MantineProvider} from '@mantine/core'
import React from 'react'

import AudioButton from '@/components/AudioButton'

// Ensure cy.mount typing is available in tests
declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: React.ReactNode, options?: any) => Chainable<any>
    }
  }
}

describe('<AudioButton />', () => {
  const testSrc = '/audio/test-sound.mp3'

  beforeEach(() => {
    // Stub play on HTMLAudioElement and alias it so we can assert calls
    cy.window().then(win => {
      cy.stub(win.HTMLAudioElement.prototype, 'play').resolves().as('play')
    })
  })

  it('renders audio element with provided src and shows a button', () => {
    cy.mount(
      <MantineProvider>
        <AudioButton src={testSrc} />
      </MantineProvider>
    )

    // audio element should have the src we passed
    cy.get('audio').should('have.attr', 'src', testSrc)

    // ActionIcon renders as a button; ensure it exists
    cy.get('button').should('exist')
  })

  it('calls audio.play when clicked', () => {
    cy.mount(
      <MantineProvider>
        <AudioButton src={testSrc} />
      </MantineProvider>
    )

    // Click the action icon/button
    cy.get('button').click()

    // Assert the stubbed play() was called
    cy.get('@play').should('have.been.called')
  })
})
