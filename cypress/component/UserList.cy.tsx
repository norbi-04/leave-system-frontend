// UserList.cy.tsx
import React from "react";
import UserList from "../../app/components/user/UserList";
import { AuthContext } from "../../app/context/AuthContext";
import { MemoryRouter } from "react-router";

const nonStaffAuthUser = { token: { role: { name: "admin" } } };
const staffAuthUser = { token: { role: { name: "staff" } } };
const user = {
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com",
};

function TestAuthProvider({ user, children }: any) {
  return (
    <AuthContext.Provider value={{ user, login: () => {}, logout: () => {}, token: "test" }}>
      {children}
    </AuthContext.Provider>
  );
}

describe("UserList", () => {
  it("renders avatar, name and email", () => {
    cy.mount(
      <MemoryRouter>
        <TestAuthProvider user={nonStaffAuthUser}>
          <UserList user={user} />
        </TestAuthProvider>
      </MemoryRouter>
    );
    cy.get("#profileAvatar").should("contain", "A");
    cy.contains("Alice Smith").should("exist");
    cy.contains("alice@example.com").should("exist");
  });

  it("renders action buttons for non-staff and responds to clicks", () => {
    const onViewDetails = cy.stub().as("viewDetails");
    const onDelete = cy.stub().as("delete");

    cy.mount(
      <MemoryRouter>
        <TestAuthProvider user={nonStaffAuthUser}>
          <UserList user={user} onViewDetails={onViewDetails} onDelete={onDelete} />
        </TestAuthProvider>
      </MemoryRouter>
    );

    cy.contains("button", "View Details").click();
    cy.get("@viewDetails").should("have.been.called");

    cy.contains("button", "Delete").click();
    cy.get("@delete").should("have.been.called");
  });

  it("hides action buttons for staff users", () => {
    cy.mount(
      <MemoryRouter>
        <TestAuthProvider user={staffAuthUser}>
          <UserList user={user} />
        </TestAuthProvider>
      </MemoryRouter>
    );

    cy.get(".btn-details").should("have.css", "visibility", "hidden");
    cy.get(".btn-delete").should("have.css", "visibility", "hidden");
  });

  it("does not break if callbacks are missing", () => {
    cy.mount(
      <MemoryRouter>
        <TestAuthProvider user={nonStaffAuthUser}>
          <UserList user={user} />
        </TestAuthProvider>
      </MemoryRouter>
    );

    cy.contains("button", "View Details").click();
    cy.contains("button", "Delete").click();
    // no errors thrown, test passes
  });
});
