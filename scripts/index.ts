/// <reference path="Database.ts" />
/// <reference path="MoneyTotals.ts" />
/// <reference path="Screen.ts" />
/// <reference path="AddNewEntry.ts" />
/// <reference path="MobileNav.ts" />

document.querySelector("body").addEventListener("touchstart", () => {}, {passive: true});

const nav:MobileNav = new MobileNav();
nav.addListeners();

const addScreen:AppScreen = new AppScreen("addNewEntryScreen");
addScreen.init();

const db:Database = new Database((db:IDBDatabase) => {

	const totals:MoneyTotals = new MoneyTotals(db);
	totals.calculate();

	const newEntry:AddNewEntry = new AddNewEntry(db, addScreen);
	newEntry.init(totals);

});
