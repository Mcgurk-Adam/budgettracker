describe("Basic Navigation Tests", () => {

	it("Opens the add entry screen", () => {

		// making sure the entry screen is hidden
		cy.get("#addNewEntryScreen").should("have.attr", "aria-hidden", "true");

		// click the button to pop the entry screen open
		cy.get("#addNewEntry").trigger("touchstart");

		cy.get("#addNewEntryScreen").should("not.have.attr", "aria-hidden");

	});

});