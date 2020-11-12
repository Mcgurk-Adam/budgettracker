/// <reference path="Table.ts" />
/// <reference path="Database.ts" />
/// <reference path="MoneyTotals.ts" />
/// <reference path="Screen.ts" />
/// <reference path="AddNewEntry.ts" />
/// <reference path="MobileNav.ts" />

if ("serviceWorker" in navigator) {

	window.addEventListener("load", () => {

		navigator.serviceWorker.register("/sw.js").then((reg:ServiceWorkerRegistration) => {
		  console.log("New SW reg", reg.scope);
		}, function(err) {
		  console.log("ServiceWorker registration failed: ", err);
		});

	});

}

document.querySelector("body").addEventListener("touchstart", () => {}, {passive: true});
const modalXButton = document.querySelectorAll("#editLogEntryModal [data-close-modal]");
const editModal:HTMLElement = document.getElementById("editLogEntryModal");
const saveEditButton:HTMLButtonElement = document.querySelector("#editLogEntryModal [data-save]");
const formElements:NodeListOf<HTMLInputElement|HTMLSelectElement> = editModal.querySelectorAll("form input, form select");
modalXButton.forEach((button:HTMLButtonElement) => {

	button.addEventListener("touchstart", () => {

		editModal.setAttribute("aria-hidden", "true");
		formElements.forEach((ele:HTMLInputElement|HTMLSelectElement) => {
			ele.value = "";
		});

	}, {passive: true});

});

const nav:MobileNav = new MobileNav();
nav.addListeners();

const addScreen:AppScreen = new AppScreen("addNewEntryScreen", true);
addScreen.init();

const logScreen:AppScreen = new AppScreen("logScreen");
logScreen.init();

const homeScreen:AppScreen = new AppScreen("dashScreen");
homeScreen.init();

const logTable:Table = new Table("#activityLogTable");
logTable.initSort();

const db:Database = new Database((db:IDBDatabase) => {

	const totals:MoneyTotals = new MoneyTotals(db);
	totals.calculate();
	totals.getHistory();

	const newEntry:AddNewEntry = new AddNewEntry(db, addScreen);
	newEntry.init(totals);

	saveEditButton.addEventListener("touchstart", () => {

		const editedObject:TransactionEntry = {
			amount: 0,
			date: new Date(),
			type: "",
			name: ""
		};

		formElements.forEach((ele:HTMLInputElement|HTMLSelectElement) => {

			if (ele.getAttribute("data-column") === "date") {
				editedObject[ele.getAttribute("data-column")] = new Date(ele.value);
			} else {
				editedObject[ele.getAttribute("data-column")] = ele.value;
			}
			
		});

		// @ts-ignore I hate that I can't call .value on document.getElementById
		Database.updateRow(db, "transactions", document.getElementById("editTransactionId").value, editedObject, () => {
			totals.calculate();
			totals.getHistory();
		});

	}, {passive: true});

});

// one-off reload button
const reloadButton = document.querySelector("[data-performs-action='reload']");
reloadButton.addEventListener("touchend", reloadApp, false);

function reloadApp() {

	// unregistering all sw registrations
	if (window.navigator && navigator.serviceWorker) {
		navigator.serviceWorker.getRegistrations()
		.then((registrations) => registrations.forEach((registration) => registration.unregister()));
	}

	document.location.reload(true);

}
