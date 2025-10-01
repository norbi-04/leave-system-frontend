import React from 'react'
import ReportingList from './ReportingList'
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

const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
}

const manager = {
  firstName: 'Manager',
  lastName: 'User',
  email: 'manager@example.com'
}

describe('<ReportingList />', () => {
  it('renders reporting line info', () => {
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <ReportingList
          user={user}
          manager={manager}
          startDate="2025-01-09"
          endDate="2025-10-09"
        />
      </AuthContext.Provider>
    )
    cy.contains('john@example.com').should('exist')
    cy.contains('manager@example.com').should('exist')
    cy.contains('2025-01-09').should('exist')
    cy.contains('2025-10-09').should('exist')
  })

  it('shows and calls admin edit/delete buttons', () => {
    const onEdit = cy.stub().as('onEdit')
    const onDelete = cy.stub().as('onDelete')
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <ReportingList
          user={user}
          manager={manager}
          startDate="2025-01-09"
          endDate="2025-10-09"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </AuthContext.Provider>
    )
    cy.get('button.btn-details').click()
    cy.get('@onEdit').should('have.been.called')
    cy.get('button.btn-delete').click()
    cy.get('@onDelete').should('have.been.called')
  })

  it('hides buttons for non-admin users', () => {
    cy.mount(
      <AuthContext.Provider value={authContextUser}>
        <ReportingList
          user={user}
          manager={manager}
          startDate="2025-01-09"
          endDate="2025-10-09"
        />
      </AuthContext.Provider>
    )
    cy.get('.btn-details').should('not.be.visible')
    cy.get('.btn-delete').should('not.be.visible')
  })
})