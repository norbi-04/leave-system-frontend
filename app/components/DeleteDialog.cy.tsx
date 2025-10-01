import React from 'react'
import DeleteDialog from './DeleteDialog'

describe('<DeleteDialog />', () => {
  it('renders title, message, and buttons', () => {
    cy.mount(
      <DeleteDialog
        title="Delete"
        message="Confirm?"
        deleteAction={() => true}
        open={true}
        onClose={() => {}}
      />
    )
    cy.contains('Delete').should('exist')
    cy.contains('Confirm?').should('exist')
    cy.contains('Delete').should('exist')
    cy.contains('Cancel').should('exist')
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = cy.stub().as('onClose')
    cy.mount(
      <DeleteDialog
        title="Delete"
        message="Confirm?"
        deleteAction={() => true}
        open={true}
        onClose={onClose}
      />
    )
    cy.contains('Cancel').click()
    cy.get('@onClose').should('have.been.called')
  })

  it('calls deleteAction when Delete is clicked', () => {
    let called = false
    function deleteAction() {
      called = true
      return Promise.resolve(true)
    }
    cy.mount(
      <DeleteDialog
        title="Delete"
        message="Confirm?"
        deleteAction={deleteAction}
        open={true}
        onClose={() => {}}
      />
    )
    cy.get('button').contains('Delete').click().then(() => {
      expect(called).to.eq(true)
    })
  })
})