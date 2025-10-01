import React from 'react'
import ProtectedRoute from './ProtectedPage'
import { AuthContext, AuthProvider } from '../context/AuthContext'
import { MemoryRouter } from 'react-router'

const auth = {
  token: 'abc',
  user: null,
  login: () => {},
  logout: () => {},
}

describe('<ProtectedRoute />', () => {
  it('renders if authenticated', () => {
    cy.mount(
      <MemoryRouter>
        <AuthContext.Provider value={auth}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    )
    cy.contains('Protected Content').should('exist')
  })

  it('redirects to login if not authenticated', () => {
    window.localStorage.removeItem('token')
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    )
    cy.contains('Protected Content').should('not.exist')
  })
})