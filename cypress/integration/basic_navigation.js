describe("Basic Navigation Tests", () => {

	beforeEach(() => {
		cy.visit("/");
	});

	it("Opens the add entry screen", () => {

		// making sure the entry screen is hidden
		cy.get("#addNewEntryScreen").should("have.attr", "aria-hidden", "true");

		// click the button to pop the entry screen open
		cy.get("#addNewEntry").trigger("touchstart");
		cy.get("#addNewEntryScreen").should("not.have.attr", "aria-hidden");

	});

	it("Closes the add entry screen when clicking on the black background screen", () => {

		// click the button to pop the entry screen open
		cy.get("#addNewEntry").trigger("touchstart");

		// CLOSES WHEN CLICKED ON THE BLACK BACKGROUND
		cy.get("#opaqueBlackBackground").trigger("touchstart");
		cy.get("#addNewEntryScreen").should("have.attr", "aria-hidden", "true");

	});

	it("Closes the add entry screen when clicking x", () => {

		// click the button to pop the entry screen open
		cy.get("#addNewEntry").trigger("touchstart");

		// CLOSES WHEN CLICKED ON THE BLACK BACKGROUND
		cy.get("#addNewEntryScreen header [data-close]").trigger("touchstart");
		cy.get("#addNewEntryScreen").should("have.attr", "aria-hidden", "true");

	});

	it("Opens the side nav", () => {

		// the nav is already closed
		cy.get("#mainNav").should("have.attr", "aria-hidden", "true");

		// touching the hamburger
		cy.get("#navSwitcher").trigger("touchstart");
		cy.get("#mainNav").should("not.have.attr", "aria-hidden");

	});

	it("Closes the side nav by clicking the black background", () => {

		// touching the hamburger
		cy.get("#navSwitcher").trigger("touchstart");

		// touching the background
		cy.get("#opaqueBlackBackground").trigger("touchstart");
		cy.get("#mainNav").should("have.attr", "aria-hidden", "true");

	});

	it("Navigates to the home screen", () => {

		cy.get('[data-opens-screen="dashScreen"]').trigger("touchstart");

		// touching the hamburger
		cy.get("#navSwitcher").trigger("touchstart");

		cy.get('[data-opens-screen="dashScreen"]').trigger("touchstart");
		cy.get("#mainNav").should("have.attr", "aria-hidden", "true");
		cy.get("#dashScreen").should("not.have.attr", "aria-hidden");

	});

});
