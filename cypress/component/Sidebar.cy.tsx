// Sidebar.cy.tsx
import React from "react";
import { Sidebar } from "../../app/components/Sidebar";
import { AuthProvider } from "../../app/context/AuthContext";
import { MemoryRouter } from "react-router";

const profile = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  role: { id: 1 },
};

describe("Sidebar", () => {
  it("shows the title", () => {
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar profile={profile} />
        </AuthProvider>
      </MemoryRouter>
    );
    cy.contains("h2", "Leave Dashboard").should("exist");
  });

  it("shows profile info", () => {
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar profile={profile} />
        </AuthProvider>
      </MemoryRouter>
    );
    cy.contains("John Doe").should("exist");
    cy.contains("john@example.com").should("exist");
  });

  it("shows Manage Leave Requests for managers", () => {
    cy.mount(
      <MemoryRouter>
        <AuthProvider>
          <Sidebar profile={profile} />
        </AuthProvider>
      </MemoryRouter>
    );
    cy.contains("li", "Manage Leave Requests").should("exist");
  });
});