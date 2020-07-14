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

			idbRequest.result.forEach((transaction:TransactionEntry) => {

				// only tracking the data for the current month
				if (currentDate.getFullYear() == transaction.date.getFullYear() && currentDate.getMonth() == transaction.date.getMonth()) {

					totalAmount += transaction.amount;
					// @ts-ignore I just need it to be a string for this very specific thing
					transaction.amount = transaction.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					// @ts-ignore I just need it to be a string for this very specific thing
					transaction.date = months[transaction.date.getMonth()] + "-" + transaction.date.getDate();

					// @ts-ignore
					const logRow = document.getElementById("logRow").content.cloneNode(true);
					// @ts-ignore
					Object.entries(transaction).forEach((key) => {
						const cellToUpdate:HTMLElement = logRow.querySelector(`[data-${key[0]}]`);
						if (cellToUpdate != null) {
							cellToUpdate.innerText = key[1];
						}
					});

					document.querySelector("#activityLogTable tbody").appendChild(logRow);

				}

			});

			document.getElementById("logTotal").innerText = totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		});

	}

}
