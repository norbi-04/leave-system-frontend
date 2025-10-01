import React from 'react'
import ApproveDialog from './ApproveDialog'

describe('<ApproveDialog />', () => {
  it('renders title, message, and buttons', () => {
    cy.mount(
      <ApproveDialog
        title="Approve Request"
        message="Confirm?"
        approveAction={() => true}
        open={true}
        onClose={() => {}}
      />
    )
    cy.contains('Approve Request').should('exist')
    cy.contains('Confirm?').should('exist')
    cy.contains('Approve').should('exist')
    cy.contains('Cancel').should('exist')
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = cy.stub().as('onClose')
    cy.mount(
      <ApproveDialog
        title="Approve Request"
        message="Confirm?"
        approveAction={() => true}
        open={true}
        onClose={onClose}
      />
    )
    cy.contains('Cancel').click()
    cy.get('@onClose').should('have.been.called')
  })

  it('calls approveAction when Approve is clicked', () => {
    let called = false
    function approveAction() {
      called = true
      return Promise.resolve(true)
    }
    cy.mount(
      <ApproveDialog
        title="Approve Request"
        message="Confirm?"
        approveAction={approveAction}
        open={true}
        onClose={() => {}}
      />
    )
    cy.get('button').contains('Approve').click().then(() => {
      expect(called).to.eq(true)
    })
  })
})