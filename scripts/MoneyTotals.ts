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

		Database.fetchAllRowsFromTable(this.db, "transactions", (idbRequest:IDBRequest) => {

			const currentDate:Date = new Date();

			idbRequest.result.forEach((transaction:TransactionEntry) => {

				// only tracking the data for the current month
				if (currentDate.getFullYear() == transaction.date.getFullYear() && currentDate.getMonth() == transaction.date.getMonth()) {

					console.log(transaction);

				}

			});

		});

	}

}
