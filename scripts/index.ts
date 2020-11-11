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
