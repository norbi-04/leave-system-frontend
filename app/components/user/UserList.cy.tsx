import React from 'react'
import UserList from './UserList'
import { AuthContext } from '../../context/AuthContext'

const admin = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  id: 1,
  role: { id: 1, name: 'admin' },
  token: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    id: 1,
    role: { id: 1, name: 'admin' }
  }
}

const staff = {
  firstName: 'Staff',
  lastName: 'User',
  email: 'user@example.com',
  id: 2,
  role: { id: 2, name: 'user' },
  token: {
    firstName: 'Normal',
    lastName: 'User',
    email: 'user@example.com',
    id: 2,
    role: { id: 2, name: 'user' }
  }
}

const authContextAdmin = {
  user: admin,
  token: 'abc',
  login: (_token: string) => {},
  logout: () => {},
}

const authContextUser = {
  user: staff,
  token: 'abc',
  login: (_token: string) => {},
  logout: () => {},
}

const rowUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
}

describe('<UserList />', () => {
  it('renders user info', () => {
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <UserList user={rowUser} />
      </AuthContext.Provider>
    )
    cy.contains('John Doe').should('exist')
    cy.contains('john@example.com').should('exist')
    cy.get('#profileAvatar').should('contain', 'J')
  })

  it('shows buttons for admin and calls the handlers', () => {
    const onDelete = cy.stub().as('onDelete')
    const onViewDetails = cy.stub().as('onViewDetails')
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <UserList user={rowUser} onDelete={onDelete} onViewDetails={onViewDetails} />
      </AuthContext.Provider>
    )
    cy.get('button.btn-details').should('exist').click()
    cy.get('@onViewDetails').should('have.been.called')
    cy.get('button.btn-delete').should('exist').click()
    cy.get('@onDelete').should('have.been.called')
  })

  it('hides buttons for non-admin users', () => {
    cy.mount(
      <AuthContext.Provider value={authContextUser}>
        <UserList user={rowUser} />
      </AuthContext.Provider>
    )
    cy.get('.btn-details').should('have.css', 'visibility', 'hidden')
    cy.get('.btn-delete').should('have.css', 'visibility', 'hidden')
  })
})