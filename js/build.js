var Database = (function () {
    function Database(onSuccessFunction) {
        this.idb = indexedDB || window.indexedDB;
        this.dbName = "money";
        try {
            this.dbReq = this.idb.open(this.dbName, 1);
        }
        catch (e) {
            Database.dataNotSupported(e);
            return;
        }
        this.successFunction = onSuccessFunction;
        this.requestHandlers();
    }
    Database.prototype.requestHandlers = function () {
        var _this = this;
        this.dbReq.onerror = function (ev) { return Database.dataNotSupported(ev); };
        this.dbReq.onsuccess = function (ev) {
            _this.setDb();
            _this.successFunction(_this.db);
        };
        this.dbReq.onupgradeneeded = function (ev) { return _this.seedDb(); };
    };
    Database.prototype.seedDb = function () {
        this.setDb();
        try {
            this.transactionTable();
        }
        catch (e) {
        }
    };
    Database.prototype.setDb = function () {
        this.db = this.db === undefined ? this.dbReq.result : this.db;
        this.db.onerror = function (ev) { return Database.dataNotSupported(ev); };
    };
    Database.prototype.transactionTable = function () {
        var projectTable = this.db.createObjectStore("transactions", {
            keyPath: "transactionId",
            autoIncrement: true
        });
        projectTable.createIndex("name", "name");
        projectTable.createIndex("type", "type");
    };
    Database.insert = function (db, tableName, keyIndex, objectToAdd, successCallback) {
        var idbTransaction = db.transaction([tableName], "readwrite");
        var objectStore = idbTransaction.objectStore(tableName);
        var objectStoreRequest = objectStore.add(objectToAdd);
        objectStoreRequest.onsuccess = function (ev) {
            successCallback(objectStoreRequest);
        };
    };
    Database.fetchAllRowsFromTable = function (db, tableName, rowFetchedCallback, rowNotFetchedCallback) {
        if (rowNotFetchedCallback === void 0) { rowNotFetchedCallback = function () { return console.log("Error"); }; }
        var idbTransaction = db.transaction([tableName]);
        var objectStore = idbTransaction.objectStore(tableName);
        var idbRequest = objectStore.getAll();
        idbRequest.onerror = function (ev) {
            console.log("errored out");
        };
        idbRequest.onsuccess = function (ev) {
            rowFetchedCallback(idbRequest);
        };
    };
    Database.fetchRowFromDatabase = function (db, tableName, keyIndex, rowFetchedCallback, rowNotFetchedCallback) {
        var idbTransaction = db.transaction([tableName], "readwrite");
        var objectStore = idbTransaction.objectStore(tableName);
        var idbRequest = objectStore.get(keyIndex);
        idbRequest.onerror = function (ev) {
            console.log("this is an error");
            console.log(ev);
        };
        idbRequest.onsuccess = function (ev) {
            if (idbRequest === undefined) {
                rowNotFetchedCallback(idbRequest);
            }
            else {
                rowFetchedCallback(idbRequest);
            }
        };
    };
    Database.deleteFromDatabase = function (db, tableName, keyIndex, rowFetchedCallback) {
        var idbTransaction = db.transaction([tableName], "readwrite");
        var objectStore = idbTransaction.objectStore(tableName);
        var idbRequest = objectStore.delete(keyIndex);
        idbRequest.onsuccess = function (ev) {
            rowFetchedCallback(idbRequest);
        };
        idbRequest.onerror = function (ev) {
            console.log(ev);
        };
    };
    Database.dataNotSupported = function (message) {
        console.log("For some reason, whatever action you just took, wasn\'t supported");
        if (message !== null && message !== undefined) {
            console.log(message);
        }
    };
    return Database;
}());
var MoneyTotals = (function () {
    function MoneyTotals(db) {
        this.db = db;
    }
    MoneyTotals.prototype.calculate = function () {
        var total = 0;
        Database.fetchAllRowsFromTable(this.db, "transactions", function (idbRequest) {
            var currentDate = new Date();
            idbRequest.result.forEach(function (transaction) {
                if (currentDate.getFullYear() == transaction.date.getFullYear() && currentDate.getMonth() == transaction.date.getMonth()) {
                    total += transaction.amount;
                }
            });
            document.getElementById("mainMoneyShow").innerText = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
    };
    return MoneyTotals;
}());
var AppScreen = (function () {
    function AppScreen(pageId) {
        this.blackBackground = document.getElementById("opaqueBlackBackground");
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
        this.blackBackground.classList.remove("shown");
        this.blackBackground.addEventListener("transitionend", AppScreen.changeBackToHidden, false);
        this.blackBackground.removeEventListener("click", this.clickedOnBackground);
        this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox]), select").forEach(function (input) {
            input.value = "";
            var inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(inputEvent);
        });
    };
    AppScreen.prototype.openScreen = function () {
        this.blackBackground.style.visibility = "visible";
        this.blackBackground.classList.add("shown");
        this.screenElement.removeAttribute("aria-hidden");
        this.blackBackground.addEventListener("click", this.clickedOnBackground.bind(this), false);
    };
    AppScreen.prototype.clickedOnBackground = function (ev) {
        if (ev.target == this.blackBackground) {
            this.closeScreen();
        }
    };
    AppScreen.changeBackToHidden = function () {
        this.style.visibility = "hidden";
        this.removeEventListener("transitionend", AppScreen.changeBackToHidden);
    };
    return AppScreen;
}());
var AddNewEntry = (function () {
    function AddNewEntry(db, addNewEntryScreen) {
        this.newEntryInput = document.getElementById("addNewValue");
        this.nameEntryInput = document.getElementById("nameOfPurchase");
        this.addEntryButton = document.getElementById("addNewEntryButton");
        this.typeSelection = document.getElementById("entrySelection");
        this.form = document.getElementById("addEntryForm");
        this.db = db;
        this.addScreen = addNewEntryScreen;
    }
    AddNewEntry.prototype.init = function (totals) {
        var _this = this;
        this.newEntryInput.addEventListener("input", function () { return _this.toggleButtonAbility(); }, false);
        this.nameEntryInput.addEventListener("input", function () { return _this.toggleButtonAbility(); }, false);
        this.typeSelection.addEventListener("change", function () { return _this.toggleButtonAbility(); }, false);
        this.addEntryButton.addEventListener("click", function () { return _this.addEntry(totals); }, false);
    };
    AddNewEntry.prototype.toggleButtonAbility = function () {
        if (this.form.checkValidity()) {
            this.addEntryButton.removeAttribute("disabled");
        }
        else {
            this.addEntryButton.setAttribute("disabled", "true");
        }
    };
    AddNewEntry.prototype.addEntry = function (totalCalc) {
        var _this = this;
        var addedValue = parseFloat(this.newEntryInput.value);
        Database.insert(this.db, "transactions", "transactionId", {
            amount: addedValue,
            type: this.typeSelection.value,
            name: this.nameEntryInput.value,
            date: new Date()
        }, function (idbRequest) {
            var createdId = idbRequest.result;
            totalCalc.calculate();
            _this.addScreen.closeScreen();
        });
    };
    return AddNewEntry;
}());
var MobileNav = (function () {
    function MobileNav() {
        this.blackBackground = document.getElementById("opaqueBlackBackground");
        this.hamburgerMenu = document.getElementById("navSwitcher");
        this.navSlideout = document.getElementById("mainNav");
    }
    MobileNav.prototype.addListeners = function () {
        var _this = this;
        this.hamburgerMenu.addEventListener("touchstart", function () { return _this.openFlyout(); }, false);
        this.navSlideout.addEventListener("touchstart", function (ev) {
            if (ev.target == _this.navSlideout) {
                _this.closeFlyout();
            }
        }, false);
    };
    MobileNav.prototype.openFlyout = function () {
        this.blackBackground.style.visibility = "visible";
        this.blackBackground.classList.add("shown");
        this.blackBackground.addEventListener("touchstart", this.closeFlyout.bind(this), false);
        this.navSlideout.removeAttribute("aria-hidden");
    };
    MobileNav.prototype.closeFlyout = function () {
        this.blackBackground.removeEventListener("touchstart", this.closeFlyout);
        this.blackBackground.classList.remove("shown");
        this.blackBackground.addEventListener("transitionend", AppScreen.changeBackToHidden, false);
        this.navSlideout.setAttribute("aria-hidden", "true");
    };
    return MobileNav;
}());
document.querySelector("body").addEventListener("touchstart", function () { }, { passive: true });
var nav = new MobileNav();
nav.addListeners();
var addScreen = new AppScreen("addNewEntryScreen");
addScreen.init();
var db = new Database(function (db) {
    var totals = new MoneyTotals(db);
    totals.calculate();
    var newEntry = new AddNewEntry(db, addScreen);
    newEntry.init(totals);
});
