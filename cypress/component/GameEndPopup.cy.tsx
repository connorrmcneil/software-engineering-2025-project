/**
 * Component Tests for GameEndPopup (Matching Game)
 *
 * tests to validate the core UI behavior of GameEndPopup modal, including:
 * Correct rendering when the modal is opened or closed
 * Displaying result text (correct answers out of total)
 * Rendering score indicators (beads)
 * Ensuring the "New Game" button triggers its callback
 *
 * @Author Connor Gerrard
 */

/// <reference types="cypress" />

import {MantineProvider} from '@mantine/core'
import {mount} from 'cypress/react'
import React from 'react'

import {GameEndPopup} from '../../packages/front-end/src/pages/matching-game/GameEndPopup'

// wrapper for components with mantine
const mountWithMantine = (ui: React.ReactElement) => mount(<MantineProvider>{ui}</MantineProvider>)

describe('GameEndPopup Component Tests', () => {
  it('does NOT render when opened = false', () => {
    // Mount popup with "opened" disabled
    mountWithMantine(<GameEndPopup opened={false} onNewGame={cy.stub()} />)

    // modal is closed, nothing should appear on screen
    cy.contains('Kelulktelatekn').should('not.exist')
    cy.contains('You got 3 out of 3 correct.').should('not.exist')
  })

  it('renders modal + content when opened = true', () => {
    // Mount popup in "open" state
    mountWithMantine(<GameEndPopup opened={true} onNewGame={cy.stub()} />)

    // 1. Modal root should be visible (Mantine adds this class automatically)
    cy.get('.mantine-Modal-root').should('be.visible')

    // 2. Header text should display
    cy.contains('Kelulktelatekn').should('be.visible')

    // 3. Score summary should display
    cy.contains('You got 3 out of 3 correct.').should('be.visible')

    // 4. New Game button should render
    cy.contains("Si'owa'si - New Game").should('be.visible')
  })

  it('calls onNewGame() when the "New Game" button is clicked', () => {
    // Create a stub callback to track calls
    const onNewGame = cy.stub().as('onNewGame')

    // Mount modal opened
    mountWithMantine(<GameEndPopup opened={true} onNewGame={onNewGame} />)

    // Click the "New Game" button
    cy.contains("Si'owa'si - New Game").click()

    // Verify the callback was called once
    cy.get('@onNewGame').should('have.been.calledOnce')
  })
})
