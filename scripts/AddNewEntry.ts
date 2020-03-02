interface TransactionEntry {
	transactionId:number;
	amount:number;
	date:Date;
	name:string;
	type:string;
}

class AddNewEntry {

	private newEntryInput:HTMLInputElement;
	private addEntryButton:HTMLButtonElement;
	private typeSelection:HTMLSelectElement;
	private db:IDBDatabase;
	private addScreen:AppScreen;

	constructor(db:IDBDatabase, addNewEntryScreen:AppScreen) {

		this.newEntryInput = document.getElementById("addNewValue") as HTMLInputElement;
		this.addEntryButton = document.getElementById("addNewEntryButton") as HTMLButtonElement;
		this.typeSelection = document.getElementById("entrySelection") as HTMLSelectElement;
		this.db = db;
		this.addScreen = addNewEntryScreen;

	}

	init(totals:MoneyTotals): void {

		this.newEntryInput.addEventListener("input", () => this.toggleButtonAbility(), false);

		this.addEntryButton.addEventListener("click", () => this.addEntry(totals), false);

	}

	private toggleButtonAbility(): void {

		const currentValue:string = this.newEntryInput.value;

		if (currentValue == "") {
			this.addEntryButton.setAttribute("disabled", "true");
		} else {
			this.addEntryButton.removeAttribute("disabled");
		}

	}

	private addEntry(totalCalc:MoneyTotals): void {

		const addedValue:number = parseFloat(this.newEntryInput.value);
		Database.insert(this.db, "transactions", "transactionId", {
			amount: addedValue,
			type: this.typeSelection.value,
			date: new Date()
		}, (idbRequest:IDBRequest) => {
			const createdId:number = idbRequest.result;
			totalCalc.calculate();
			this.addScreen.closeScreen();
		})

	}

}
