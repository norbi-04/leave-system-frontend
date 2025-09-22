// RightPanel.cy.tsx
import React from "react";
import RightPanel from "../../app/components/RightPanel";

describe("RightPanel", () => {
  let baseProps: any;

  beforeEach(() => {
    baseProps = {
      open: true,
      onClose: cy.stub().as("onClose"),
      title: "Test Panel",
      children: <div data-cy="child">Hello World</div>,
      editTitle: "Edit",
      deleteTitle: "Delete",
      saveTitle: "Save",
      cancelTitle: "Cancel",
      editAction: cy.stub().as("editAction"),
      deleteAction: cy.stub().as("deleteAction"),
      saveAction: cy.stub().as("saveAction"),
      onCancel: cy.stub().as("onCancel"),
    };
  });

  it("renders when open", () => {
    cy.mount(<RightPanel {...baseProps} open={true} />);
    cy.contains("Test Panel").should("exist");
    cy.get(".right-panel-backdrop").should("exist");
  });

  it("does not render backdrop when closed", () => {
    cy.mount(<RightPanel {...baseProps} open={false} />);
    cy.get(".right-panel-backdrop").should("not.exist");
  });

  it("renders children", () => {
    cy.mount(<RightPanel {...baseProps} />);
    cy.get("[data-cy=child]").should("contain", "Hello World");
  });

  it("calls onClose when clicking backdrop and close button", () => {
    cy.mount(<RightPanel {...baseProps} />);
    cy.get(".right-panel-backdrop").click({ force: true });
    cy.get("@onClose").should("have.been.calledOnce");

    cy.get("button.btn-close").click();
    cy.get("@onClose").should("have.been.calledTwice");
  });

  it("shows edit + delete when not editing", () => {
    cy.mount(<RightPanel {...baseProps} editing={false} />);
    cy.contains("Edit").click();
    cy.get("@editAction").should("have.been.called");

    cy.contains("Delete").click();
    cy.get("@deleteAction").should("have.been.called");
  });

  it("shows save + cancel when editing", () => {
    cy.mount(<RightPanel {...baseProps} editing={true} />);
    cy.contains("Save").click();
    cy.get("@saveAction").should("have.been.called");

    cy.contains("Cancel").click();
    cy.get("@onCancel").should("have.been.called");
  });

  it("hides edit button if disableEdit is true", () => {
    cy.mount(<RightPanel {...baseProps} disableEdit={true} editing={false} />);
    cy.contains("Edit").should("not.exist");
  });
});
