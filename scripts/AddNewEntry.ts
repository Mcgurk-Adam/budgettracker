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
	private db:IDBDatabase;
	private addScreen:AppScreen;

	constructor(db:IDBDatabase, addNewEntryScreen:AppScreen) {

		this.newEntryInput = document.getElementById("addNewValue") as HTMLInputElement;
		this.addEntryButton = document.getElementById("addNewEntryButton") as HTMLButtonElement;
		this.db = db;
		this.addScreen = addNewEntryScreen;

	}

	init(): void {

		this.newEntryInput.addEventListener("input", () => this.toggleButtonAbility(), false);

		this.addEntryButton.addEventListener("click", () => this.addEntry(), false);

	}

	private toggleButtonAbility(): void {

		const currentValue:string = this.newEntryInput.value;

		if (currentValue == "") {
			this.addEntryButton.setAttribute("disabled", "true");
		} else {
			this.addEntryButton.removeAttribute("disabled");
		}

	}

	private addEntry(): void {

		const addedValue:number = parseFloat(this.newEntryInput.value);
		Database.insert(this.db, "transactions", "transactionId", {
			amount: addedValue,
			date: new Date()
		}, (idbRequest:IDBRequest) => {
			const createdId:number = idbRequest.result;
			this.addScreen.closeScreen();
		})

	}

}
