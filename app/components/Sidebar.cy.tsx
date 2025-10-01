import React from 'react'
import { Sidebar } from './Sidebar'
import { AuthProvider } from '~/context/AuthContext'
import { MemoryRouter } from 'react-router' 

const profile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: { id: 2 }
}

describe('<Sidebar />', () => {
  it('renders navigation, profile and logout', () => {
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar profile={profile} />
        </AuthProvider>
      </MemoryRouter>
    )

    cy.contains('Leave Dashboard').should('exist')
    cy.contains('Home').should('exist')
    cy.contains('My Leave').should('exist')
    cy.contains('Manage Leave Requests').should('exist')
    cy.contains('Users').should('exist')
    cy.contains('Reporting Line').should('exist')
    cy.contains('John Doe').should('exist')
    cy.contains('john@example.com').should('exist')
    cy.contains('Logout').should('exist')
  })

  it('hides "Manage Leave Requests" for role id 3', () => {
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar profile={{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: { id: 3 } }} />
        </AuthProvider>
      </MemoryRouter>
    )

    cy.contains('Manage Leave Requests').should('not.exist')
  })
})