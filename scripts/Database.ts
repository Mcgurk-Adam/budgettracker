class Database {

	private idb:IDBFactory = indexedDB || window.indexedDB;
	private dbName:string = "money";
	private dbReq:IDBOpenDBRequest;
	public db:IDBDatabase;
	protected transaction:IDBTransaction;
	protected successFunction:Function;
	private keyPathString:string = "transactionId";

	/**
	 *
	 * @constructor
	 * 
	 * Opens the IndexedDB request and makes the calls to add the request handlers
	 *
	 */

	constructor(onSuccessFunction:Function) {

		try {
			this.dbReq = this.idb.open(this.dbName, 1);
		} catch (e) {
			Database.dataNotSupported(e);
			return;
		}

		this.successFunction = onSuccessFunction;
		
		this.requestHandlers();

	}

	protected requestHandlers(): void {

		// basic error handling
		this.dbReq.onerror = (ev:Event) => Database.dataNotSupported(ev);

		// basic success handling
		this.dbReq.onsuccess = (ev:Event) => {
			this.setDb();
			this.successFunction(this.db);
		}

		this.dbReq.onupgradeneeded = (ev:Event) => this.seedDb();

	}

	private seedDb(): void {

		// setting the database for future use
		this.setDb();

		try {
			this.transactionTable();
		} catch (e) {
			// project table already exists, fail silently
		}

	}

	private setDb(): void {

		// setting the db
		this.db = this.db === undefined ? this.dbReq.result : this.db;

		// setting an error handler for the db
		this.db.onerror = (ev:Event) => Database.dataNotSupported(ev);

	}

	private transactionTable(): void {

		let projectTable:IDBObjectStore = this.db.createObjectStore("transactions", {
			keyPath: this.keyPathString,
			autoIncrement: true
		});
		projectTable.createIndex("name", "name");
		projectTable.createIndex("type", "type");

	}

	public static insert(db:IDBDatabase, tableName:string, keyIndex:string, objectToAdd:object, successCallback:Function): void {

		// running the database transaction
		const idbTransaction:IDBTransaction = db.transaction([tableName], "readwrite");
		const objectStore:IDBObjectStore = idbTransaction.objectStore(tableName);
		const objectStoreRequest:IDBRequest<IDBValidKey> = objectStore.add(objectToAdd);
		objectStoreRequest.onsuccess = (ev:Event) => {
			successCallback(objectStoreRequest);
		};

	}

	public static updateRow(db:IDBDatabase, tableName:string, keyIndex:number|string, objectToUpdate:object, successCallback:Function): void {

		// running the database transaction
		const idbTransaction:IDBTransaction = db.transaction([tableName], "readwrite");
		const objectStore:IDBObjectStore = idbTransaction.objectStore(tableName);
		objectStore.openCursor(keyIndex).onsuccess = (ev:Event) => {

			// @ts-ignore it most definitely does
			const idbCursor:IDBCursor = event.target.result;

			// @ts-ignore
			const oldObject:object = idbCursor.value;

			if (idbCursor) {

				// @ts-ignore
				Object.entries(oldObject).forEach((key) => {

					const keyName:string = key[0];
					const keyValue:string = key[1];

					if (objectToUpdate[keyName] == undefined) {
						throw "The object passed doesn't have all of the keys necessary. Specifically, it's missing: " + keyName;
					} else {
						oldObject[keyName] = objectToUpdate[keyName];
					}

				});

				const idbRequest:IDBRequest = idbCursor.update(oldObject);
				idbRequest.onsuccess = (ev:Event) => {

					successCallback(idbRequest);

				};

			}

		};

	}

	public static fetchAllRowsFromTable(db:IDBDatabase, tableName:string, rowFetchedCallback:Function, rowNotFetchedCallback:Function = () => console.log("Error")): void {

		const idbTransaction:IDBTransaction = db.transaction([tableName]);
		const objectStore:IDBObjectStore = idbTransaction.objectStore(tableName);
		const idbRequest:IDBRequest = objectStore.getAll();

		idbRequest.onerror = (ev:Event) => {
			console.log("errored out");
		};

		idbRequest.onsuccess = (ev:Event) => {
			rowFetchedCallback(idbRequest);
		};
	}

	public static fetchRowFromDatabase(db:IDBDatabase, tableName:string, keyIndex:number|string, rowFetchedCallback:Function, rowNotFetchedCallback:Function): void {

		// running the database transaction
		const idbTransaction:IDBTransaction = db.transaction([tableName], "readwrite");
		const objectStore:IDBObjectStore = idbTransaction.objectStore(tableName);
		const idbRequest:IDBRequest = objectStore.get(keyIndex);

		// what happens when it errors out?
		idbRequest.onerror = (ev:Event) => {
			console.log("this is an error");
			console.log(ev);
		}

		idbRequest.onsuccess = (ev:Event) => {

			if (idbRequest === undefined) {
				rowNotFetchedCallback(idbRequest);
			} else {
				rowFetchedCallback(idbRequest);
			}

		}

	}

	public static deleteFromDatabase(db:IDBDatabase, tableName:string, keyIndex:number|string, rowFetchedCallback:Function): void {

		// running the database transaction
		const idbTransaction:IDBTransaction = db.transaction([tableName], "readwrite");
		const objectStore:IDBObjectStore = idbTransaction.objectStore(tableName);
		const idbRequest:IDBRequest = objectStore.delete(keyIndex);

		idbRequest.onsuccess = (ev:Event) => {
			rowFetchedCallback(idbRequest);
		}

		idbRequest.onerror = (ev:Event) => {
			console.log(ev);
		}

	}

	public static dataNotSupported(message?:string|Event): void {

		console.log("For some reason, whatever action you just took, wasn\'t supported");

		if (message !== null && message !== undefined) {
			console.log(message);
		}

		// run something here that will trigger the UI to throw up an error

	}

}
