import React from 'react'
import RightPanel from './RightPanel'

describe('<RightPanel />', () => {

  it('renders with title and children', () => {
    cy.mount(
      <RightPanel
        open={true}
        onClose={cy.stub().as('onClose')}
        title="Test Panel"
      >
        <div>Panel Content</div>
      </RightPanel>
    )
    cy.contains('Test Panel').should('exist')
    cy.contains('Panel Content').should('exist')
  })

  it('calls onClose when close button is clicked', () => {
    cy.mount(
      <RightPanel
        open={true}
        onClose={cy.stub().as('onClose')}
        title="Test Panel"
      >
        <div>Panel Content</div>
      </RightPanel>
    )
    cy.get('.btn-close').click()
    cy.get('@onClose').should('have.been.called')
  })

  it('shows edit and delete buttons when not editing', () => {
    cy.mount(
      <RightPanel
        open={true}
        onClose={() => {}}
        title="Test Panel"
        editAction={cy.stub().as('editAction')}
        deleteAction={cy.stub().as('deleteAction')}
        editTitle="Edit"
        deleteTitle="Delete"
        editing={false}
      >
        <div>Panel Content</div>
      </RightPanel>
    )
    cy.contains('Edit').should('exist')
    cy.contains('Delete').should('exist')
  })

  it('shows Save and cancel buttons when editing', () => {
    cy.mount(
      <RightPanel
        open={true}
        onClose={() => {}}
        title="Test Panel"
        saveAction={cy.stub().as('saveAction')}
        onCancel={cy.stub().as('onCancel')}
        saveTitle="Save"
        cancelTitle="Cancel"
        editing={true}
      >
        <div>Panel Content</div>
      </RightPanel>
    )
    cy.contains('Save').should('exist')
    cy.contains('Cancel').should('exist')
  })

  it('calls editAction and deleteAction when buttons are clicked (not editing)', () => {
    cy.mount(
      <RightPanel
        open={true}
        onClose={() => {}}
        title="Test Panel"
        editAction={cy.stub().as('editAction')}
        deleteAction={cy.stub().as('deleteAction')}
        editTitle="Edit"
        deleteTitle="Delete"
        editing={false}
      >
        <div>Panel Content</div>
      </RightPanel>
    )
    cy.contains('Edit').click()
    cy.get('@editAction').should('have.been.called')

    cy.contains('Delete').click()
    cy.get('@deleteAction').should('have.been.called')
  })

  it('calls saveAction and onCancel when buttons are clicked (editing)', () => {
    cy.mount(
      <RightPanel
        open={true}
        onClose={() => {}}
        title="Test Panel"
        saveAction={cy.stub().as('saveAction')}
        onCancel={cy.stub().as('onCancel')}
        saveTitle="Save"
        cancelTitle="Cancel"
        editing={true}
      >
        <div>Panel Content</div>
      </RightPanel>
    )
    cy.contains('Save').click()
    cy.get('@saveAction').should('have.been.called')

    cy.contains('Cancel').click()
    cy.get('@onCancel').should('have.been.called')
  })
})