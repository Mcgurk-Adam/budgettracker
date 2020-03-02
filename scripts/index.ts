/// <reference path="Database.ts" />
/// <reference path="Screen.ts" />
/// <reference path="AddNewEntry.ts" />
document.querySelector("body").addEventListener("touchstart", () => {}, {passive: true});
const addScreen:AppScreen = new AppScreen("addNewEntryScreen");
addScreen.init();

const db:Database = new Database((db:IDBDatabase) => {
	const newEntry:AddNewEntry = new AddNewEntry(db, addScreen);
	newEntry.init();
});