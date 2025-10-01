import React from 'react'
import ReportingForm from './ReportingForm'

const users = [
  { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' },
  { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' }
]

const managers = [
  { id: 3, firstName: 'Carol', lastName: 'Brown', email: 'carol@example.com' },
  { id: 4, firstName: 'Dan', lastName: 'White', email: 'dan@example.com' }
]

describe('<ReportingForm />', () => {
  it('renders all fields with initial data', () => {
    cy.mount(
      <ReportingForm
        users={users}
        managers={managers}
        onSubmit={() => {}}
        initial={{
          user_id: 2,
          manager_id: 3,
          startDate: '2024-01-01',
          endDate: '2025-12-31' 
        }}
      />
    )
    cy.get('select').eq(0).should('have.value', '2')
    cy.get('select').eq(1).should('have.value', '3')
    cy.get('input[type="date"]').eq(0).should('have.value', '2024-01-01')
    cy.get('input[type="date"]').eq(1).should('have.value', '2025-12-31')
  })

  it('calls onSubmit with updated data', () => {
    const onSubmit = cy.stub().as('onSubmit')
    cy.mount(
      <ReportingForm
        users={users}
        managers={managers}
        onSubmit={onSubmit}
        initial={{
          user_id: 1,
          manager_id: 3,
          startDate: '2024-01-01',
          endDate: ''
        }}
      />
    )
    cy.get('select').eq(0).select('2') 
    cy.get('select').eq(1).select('4') 
    cy.get('input[type="date"]').eq(0).clear().type('2024-02-01')
    cy.get('input[type="date"]').eq(1).clear().type('2025-05-03')
    cy.get('form').submit().then(() => {
      cy.get('@onSubmit').should('have.been.calledWithMatch', {
        user_id: 2,
        manager_id: 4,
        startDate: '2024-02-01',
        endDate: '2025-05-03'
      })
    })
  })
})