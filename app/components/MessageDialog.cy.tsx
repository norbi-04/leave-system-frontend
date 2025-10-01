import React from 'react'
import MessageDialog from './MessageDialog'

describe('<MessageDialog />', () => {

  it('renders success message', () => {
    cy.mount(
      <MessageDialog
        type="success"
        message="Worked!"
        onClose={() => {}}
      />
    )
    cy.contains('Worked!').should('exist')
    cy.get('.bg-green-500').should('exist')
  })

  it('renders error message', () => {
    cy.mount(
      <MessageDialog
        type="error"
        message="Went wrong!"
        onClose={() => {}}
      />
    )
    cy.contains('Went wrong!').should('exist')
    cy.get('.bg-red-500').should('exist')
  })

})