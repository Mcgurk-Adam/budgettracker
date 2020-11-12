class MoneyTotals {

	private db:IDBDatabase;

	constructor(db:IDBDatabase) {
		this.db = db;
	}

	calculate(): void {

		let total:number = 0;

		Database.fetchAllRowsFromTable(this.db, "transactions", (idbRequest:IDBRequest) => {

			const currentDate:Date = new Date();

			idbRequest.result.forEach((transaction:TransactionEntry) => {

				// only tracking the data for the current month
				if (currentDate.getFullYear() == transaction.date.getFullYear() && currentDate.getMonth() == transaction.date.getMonth()) {

					total += transaction.amount;

				}

			});

			document.getElementById("mainMoneyShow").innerText = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		});

	}

	getHistory(): void {

		let totalAmount:number = 0;

		Database.fetchAllRowsFromTable(this.db, "transactions", (idbRequest:IDBRequest) => {

			const currentDate:Date = new Date();
			const tbody = document.querySelector("#activityLogTable tbody");
			tbody.innerHTML = "";

			idbRequest.result.forEach((transaction:TransactionEntry) => {

				// only tracking the data for the current month
				if (currentDate.getFullYear() == transaction.date.getFullYear() && currentDate.getMonth() == transaction.date.getMonth()) {

					// @ts-ignore
					const logRow = document.getElementById("logRow").content.cloneNode(true) as HTMLElement;

					logRow.querySelector("[data-amount]").setAttribute("data-raw-value", transaction.amount.toString());

					totalAmount += transaction.amount;
					// @ts-ignore I just need it to be a string for this very specific thing
					transaction.amount = transaction.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					// @ts-ignore I just need it to be a string for this very specific thing
					transaction.date = months[transaction.date.getMonth()] + "-" + transaction.date.getDate();
					// @ts-ignore
					Object.entries(transaction).forEach((key) => {
						const cellToUpdate:HTMLElement = logRow.querySelector(`[data-${key[0]}]`);
						if (cellToUpdate != null) {
							cellToUpdate.innerText = key[1];
						}
					});

					// giving the delete button the events
					logRow.querySelector(".trash").addEventListener("touchstart", () => {

						const wantToDelete:boolean = window.confirm("Are you sure you want to delete this transaction?");

						if (wantToDelete) {

							Database.deleteFromDatabase(this.db, "transactions", transaction.transactionId, () => {

								this.calculate();
								this.getHistory();

							});

						}

					}, {passive: true});

					// giving the edit button then events
					logRow.querySelector(".edit").addEventListener("touchstart", () => {

						Database.fetchRowFromDatabase(this.db, "transactions", transaction.transactionId, (idbRequest) => {

							const transactionRow:object = idbRequest.result;
							const editModal:HTMLElement = document.getElementById("editLogEntryModal");
							editModal.removeAttribute("aria-hidden");

						}, () => console.log("Not able to fetch"));

					}, {passive: true});

					tbody.appendChild(logRow);

				}

			});

			document.getElementById("logTotal").innerText = totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		});

	}

}
