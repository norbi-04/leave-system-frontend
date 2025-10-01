import React from 'react'
import UserDetails from './UserDetails'

const user = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  department: { id: 1, name: 'Engineering' },
  role: { id: 2, name: 'Staff' },
  leaveBalance: 12,
}

describe('<UserDetails />', () => {
  it('renders all user details', () => {
    cy.mount(<UserDetails user={user} />)
    cy.contains('First Name')
    cy.contains('Jane')
    cy.contains('Last Name')
    cy.contains('Doe')
    cy.contains('Email')
    cy.contains('jane@example.com')
    cy.contains('Department')
    cy.contains('Engineering')
    cy.contains('Role')
    cy.contains('Staff')
    cy.contains('Leave Balance')
    cy.contains('12')
  })

})