import React from 'react'
import UserForm from './UserForm'

const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  department: { id: 1, name: 'IT' },
  role: { id: 2, name: 'Staff' },
  leaveBalance: 10,
}

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Staff' }
]

const departments = [
  { id: 1, name: 'IT' },
  { id: 2, name: 'Finance' }
]

describe('<UserForm />', () => {
  it('renders all fields with user data', () => {
    cy.mount(
      <UserForm
        user={user}
        roles={roles}
        departments={departments}
        onSubmit={() => {}}
      />
    )
    cy.get('input[type="text"]').eq(0).should('have.value', 'John')
    cy.get('input[type="text"]').eq(1).should('have.value', 'Doe')
    cy.get('input[type="email"]').should('have.value', 'john@example.com')
    cy.get('select').eq(0).should('have.value', '1')
    cy.get('select').eq(1).should('have.value', '2')
    cy.get('input[type="number"]').should('have.value', '10')
    cy.get('input[type="password"]').should('have.value', '')
  })

  it('calls onSubmit with updated data', () => {
    const onSubmit = cy.stub().as('onSubmit')
    cy.mount(
      <UserForm
        user={user}
        roles={roles}
        departments={departments}
        onSubmit={onSubmit}
      />
    )
    cy.get('input[type="text"]').eq(0).clear().type('Johnny')
    cy.get('input[type="email"]').clear().type('johnny@example.com')
    cy.get('select').eq(0).select('2')
    cy.get('select').eq(1).select('1')
    cy.get('input[type="number"]').invoke('val', '').type('20').should('have.value', '20')
    cy.get('input[type="password"]').type('newpass')
    cy.get('form').submit().then(() => {
      cy.get('@onSubmit').should('have.been.calledWithMatch', {
        firstName: 'Johnny',
        email: 'johnny@example.com',
        department: { id: 2, name: 'Finance' },
        role: { id: 1, name: 'Admin' },
        leaveBalance: 20,
        password: 'newpass'
      })
    })
  })
})