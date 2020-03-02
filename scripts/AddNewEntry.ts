class AddNewEntry {

	private newEntryInput:HTMLInputElement;
	private addEntryButton:HTMLButtonElement;

	constructor() {

		this.newEntryInput = document.getElementById("addNewValue") as HTMLInputElement;
		this.addEntryButton = document.getElementById("addNewEntryButton") as HTMLButtonElement;
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
		console.log(addedValue);

	}

}
