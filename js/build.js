var AppScreen = (function () {
    function AppScreen(pageId) {
        this.screenId = pageId;
        this.screenElement = document.getElementById(pageId);
        if (this.screenElement == null) {
            throw "Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";
        }
    }
    AppScreen.prototype.init = function () {
        this.attachCloseListeners();
        this.attachOpenListeners();
    };
    AppScreen.prototype.attachCloseListeners = function () {
        var _this = this;
        var closeButtons = this.screenElement.querySelectorAll("[data-close]");
        closeButtons.forEach(function (button) {
            button.addEventListener("click", function () { return _this.closeScreen(); }, false);
        });
    };
    AppScreen.prototype.attachOpenListeners = function () {
        var _this = this;
        var openButtons = document.querySelectorAll("[data-opens-screen=\"" + this.screenId + "\"]");
        openButtons.forEach(function (button) {
            button.addEventListener("click", function () { return _this.openScreen(); }, false);
        });
    };
    AppScreen.prototype.closeScreen = function () {
        this.screenElement.setAttribute("aria-hidden", "true");
        this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox])").forEach(function (input) {
            input.value = "";
            var inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(inputEvent);
        });
    };
    AppScreen.prototype.openScreen = function () {
        this.screenElement.removeAttribute("aria-hidden");
    };
    return AppScreen;
}());
var AddNewEntry = (function () {
    function AddNewEntry() {
        this.newEntryInput = document.getElementById("addNewValue");
        this.addEntryButton = document.getElementById("addNewEntryButton");
    }
    AddNewEntry.prototype.init = function () {
        var _this = this;
        this.newEntryInput.addEventListener("input", function () { return _this.toggleButtonAbility(); }, false);
        this.addEntryButton.addEventListener("click", function () { return _this.addEntry(); }, false);
    };
    AddNewEntry.prototype.toggleButtonAbility = function () {
        var currentValue = this.newEntryInput.value;
        if (currentValue == "") {
            this.addEntryButton.setAttribute("disabled", "true");
        }
        else {
            this.addEntryButton.removeAttribute("disabled");
        }
    };
    AddNewEntry.prototype.addEntry = function () {
        var addedValue = parseFloat(this.newEntryInput.value);
        console.log(addedValue);
    };
    return AddNewEntry;
}());
document.querySelector("body").addEventListener("touchstart", function () { }, { passive: true });
var addScreen = new AppScreen("addNewEntryScreen");
addScreen.init();
var newEntry = new AddNewEntry();
newEntry.init();
