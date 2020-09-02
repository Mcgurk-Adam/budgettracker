describe("Testing the add entry screen", () => {

	beforeEach(() => {

		cy.visit("/");
		cy.get("#addNewEntry").trigger("touchstart");

	});

	it("Is disabled on first navigation", () => {
		cy.get("#addNewEntryButton").should("have.attr", "disabled");
	});

});