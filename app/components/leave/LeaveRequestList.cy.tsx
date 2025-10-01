import React from 'react'
import LeaveRequestList from './LeaveRequestList'
import { AuthContext } from '~/context/AuthContext'

const admin = {
  firstName: 'Alice',
  lastName: 'Admin',
  email: 'alice.admin@example.com',
  id: 1,
  role: { id: 1, name: 'admin' },
  department: { id: 1, name: 'IT' },
  leaveBalance: 99,
  token: {
    firstName: 'Alice',
    lastName: 'Admin',
    email: 'alice.admin@example.com',
    id: 1,
    role: { id: 1, name: 'admin' },
    department: { id: 1, name: 'IT' },
    leaveBalance: 99
  }
}

const manager = {
  firstName: 'Bob',
  lastName: 'Manager',
  email: 'bob.manager@example.com',
  id: 2,
  role: { id: 2, name: 'manager' },
  department: { id: 2, name: 'HR' },
  leaveBalance: 30,
  token: {
    firstName: 'Bob',
    lastName: 'Manager',
    email: 'bob.manager@example.com',
    id: 2,
    role: { id: 2, name: 'manager' },
    department: { id: 2, name: 'HR' },
    leaveBalance: 30
  }
}

const staff = {
  firstName: 'Carol',
  lastName: 'Staff',
  email: 'carol.staff@example.com',
  id: 3,
  role: { id: 3, name: 'user' },
  department: { id: 3, name: 'Finance' },
  leaveBalance: 12,
  token: {
    firstName: 'Carol',
    lastName: 'Staff',
    email: 'carol.staff@example.com',
    id: 3,
    role: { id: 3, name: 'user' },
    department: { id: 3, name: 'Finance' },
    leaveBalance: 12
  }
}

const authContextAdmin = {
  user: admin,
  token: 'admin-token',
  login: (_token: string) => {},
  logout: () => {},
}

const authContextManager = {
  user: manager,
  token: 'manager-token',
  login: (_token: string) => {},
  logout: () => {},
}

const authContextStaff = {
  user: staff,
  token: 'staff-token',
  login: (_token: string) => {},
  logout: () => {},
}

const requests = [
  {
    id: 1,
    user: staff,
    manager: manager,
    startDate: '2025-01-10',
    endDate: '2025-01-15',
    days: 6,
    status: 'Pending' as 'Pending',
    reason: null,
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 2,
    user: staff,
    manager: manager,
    startDate: '2025-02-01',
    endDate: '2025-02-03',
    days: 3,
    status: 'Rejected' as 'Rejected',
    reason: 'Not enough leave balance',
    createdAt: '2024-12-02T10:00:00Z'
  },
  {
    id: 3,
    user: staff,
    manager: admin,
    startDate: '2025-03-05',
    endDate: '2025-03-07',
    days: 3,
    status: 'Approved' as 'Approved',
    reason: null,
    createdAt: '2024-12-03T10:00:00Z'
  }
]

beforeEach(() => {
  cy.intercept('GET', '**/api/users/*', { statusCode: 200, body: staff });
  cy.intercept('GET', '**/api/reporting-lines/', { statusCode: 200, body: [] });
});

describe('<LeaveRequestList />', () => {
  it('renders leave requests', () => {
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <LeaveRequestList requests={requests} type="all" />
      </AuthContext.Provider>
    )
    cy.contains('2025-01-10').should('exist')
    cy.contains('2025-01-15').should('exist')
    cy.contains('Pending').should('exist')
    cy.contains('2025-02-01').should('exist')
    cy.contains('2025-02-03').should('exist')
    cy.contains('Rejected').should('exist')
    cy.contains('2025-03-05').should('exist')
    cy.contains('2025-03-07').should('exist')
    cy.contains('Approved').should('exist')
    cy.contains('carol.staff@example.com').should('exist')
    cy.contains('bob.manager@example.com').should('exist')
  })

  it('shows buttons for admin', () => {
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <LeaveRequestList requests={requests} type="all" />
      </AuthContext.Provider>
    )
    cy.get('button.btn-primary').should('exist')
    cy.get('button.btn-delete').should('exist')
  })

  it('shows view reason button for rejected requests', () => {
    cy.mount(
      <AuthContext.Provider value={authContextAdmin}>
        <LeaveRequestList requests={requests} type="all" />
      </AuthContext.Provider>
    )
    cy.contains('View Reason').should('exist')
  })

  it('hides buttons for staff', () => {
    cy.mount(
      <AuthContext.Provider value={authContextStaff}>
        <LeaveRequestList requests={requests} type="my" />
      </AuthContext.Provider>
    )
    cy.get('button.btn-primary:visible').should('have.length', 0)
    cy.get('button.btn-delete:visible').should('have.length', 0)
  })
})