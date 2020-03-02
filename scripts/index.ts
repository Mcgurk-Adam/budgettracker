/// <reference path="Screen.ts" />
document.querySelector("body").addEventListener("touchstart", () => {}, {passive: true});
const addScreen:AppScreen = new AppScreen("addNewEntryScreen");