interface TransactionEntry {
	transactionId?:number;
	amount:number;
	date:Date;
	type:string;
	name:string;
}

class AddNewEntry {

	private newEntryInput:HTMLInputElement;
	private nameEntryInput:HTMLInputElement;
	private addEntryButton:HTMLButtonElement;
	private typeSelection:HTMLSelectElement;
	private form:HTMLFormElement;
	private db:IDBDatabase;
	private addScreen:AppScreen;

	constructor(db:IDBDatabase, addNewEntryScreen:AppScreen) {

		this.newEntryInput = document.getElementById("addNewValue") as HTMLInputElement;
		this.nameEntryInput = document.getElementById("nameOfPurchase") as HTMLInputElement;
		this.addEntryButton = document.getElementById("addNewEntryButton") as HTMLButtonElement;
		this.typeSelection = document.getElementById("entrySelection") as HTMLSelectElement;
		this.form = document.getElementById("addEntryForm") as HTMLFormElement;
		this.db = db;
		this.addScreen = addNewEntryScreen;

	}

	init(totals:MoneyTotals): void {

		this.newEntryInput.addEventListener("input", () => this.toggleButtonAbility(), false);
		this.nameEntryInput.addEventListener("input", () => this.toggleButtonAbility(), false);
		this.typeSelection.addEventListener("change", () => this.toggleButtonAbility(), false);

		this.addEntryButton.addEventListener("click", () => this.addEntry(totals), false);

	}

	private toggleButtonAbility(): void {

		if (this.form.checkValidity()) {
			this.addEntryButton.removeAttribute("disabled");
		} else {
			this.addEntryButton.setAttribute("disabled", "true");
		}

	}

	private addEntry(totalCalc:MoneyTotals): void {

		const addedValue:number = parseFloat(this.newEntryInput.value);
		Database.insert(this.db, "transactions", "transactionId", {
			amount: addedValue,
			type: this.typeSelection.value,
			name: this.nameEntryInput.value,
			date: new Date()
		}, (idbRequest:IDBRequest) => {
			const createdId:number = idbRequest.result;
			totalCalc.calculate();
			totalCalc.getHistory();
			this.addScreen.closeScreen();
		})

	}

}
