/// <reference path="Screen.ts" />
/// <reference path="AddNewEntry.ts" />
document.querySelector("body").addEventListener("touchstart", () => {}, {passive: true});
const addScreen:AppScreen = new AppScreen("addNewEntryScreen");
addScreen.init();
const newEntry:AddNewEntry = new AddNewEntry();
newEntry.init();