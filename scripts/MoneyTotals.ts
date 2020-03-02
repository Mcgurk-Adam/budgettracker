class MoneyTotals {

	private db:IDBDatabase;

	constructor(db:IDBDatabase) {
		this.db = db;
	}

	calculate(): void {

		let total:number = 0;

		Database.fetchAllRowsFromTable(this.db, "transactions", (idbRequest:IDBRequest) => {

			idbRequest.result.forEach((transaction:TransactionEntry) => {
				total += transaction.amount;
			});

			document.getElementById("mainMoneyShow").innerText = total.toString();

		});

	}

}
