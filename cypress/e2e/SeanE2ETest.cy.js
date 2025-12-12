/**
 * E2E Tests for Admin Page
 *
 * - Sign in using the default seeded admin user (username: admin, password: admin)
 * - Verify admin page content (greeting, table header)
 * - Sign out and verify redirect to signin
 */

describe('Admin Page E2E', () => {
  beforeEach(() => {
    // Visit the admin signin page before each test
    cy.visit('http://localhost:5173/admin/signin')
  })

  it('signs in as default admin and shows admin page', () => {
    cy.get('input[placeholder="Enter your username"]').type('admin')
    cy.get('input[placeholder="Enter your password"]').type('admin')
    cy.contains('Sign in').click()

    // Ensure we've been redirected to the admin page
    cy.location('pathname').should('include', '/admin')

    // Validate greeting and table header exist
    cy.contains('Hello, Admin User').should('be.visible')
    cy.contains("Mi'kmaq").should('exist')
  })

  it('signs out from admin page', () => {
    // Sign in first
    cy.get('input[placeholder="Enter your username"]').type('admin')
    cy.get('input[placeholder="Enter your password"]').type('admin')
    cy.contains('Sign in').click()

    cy.location('pathname').should('include', '/admin')

    // Click sign out and expect to be redirected back to signin page
    cy.contains('Sign out').click()
    cy.location('pathname', {timeout: 5000}).should('include', '/admin/signin')
  })
})
