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
var Table = (function () {
    function Table(tableQuery) {
        this.table = document.querySelector(tableQuery);
    }
    Table.prototype.initSort = function () {
        var _this = this;
        var headings = this.table.querySelectorAll("thead th:not([data-no-sort])");
        headings.forEach(function (heading) {
            heading.addEventListener("touchstart", function () {
                headings.forEach(function (head) {
                    if (head != heading) {
                        head.classList.remove("sorting");
                        head.removeAttribute("data-order-by");
                    }
                });
                heading.classList.add("sorting");
                var direction = heading.getAttribute("data-order-by") == null || heading.getAttribute("data-order-by") == "ASC" ? "DESC" : "ASC";
                heading.setAttribute("data-order-by", direction);
                var sortAsc = direction == "ASC" ? true : false;
                var comparer = function (idx, asc) { return function (a, b) { return (function (v1, v2) {
                    return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
                })(_this.getCellValue(asc ? a : b, idx), _this.getCellValue(asc ? b : a, idx)); }; };
                var sortedData = Array.from(_this.table.querySelectorAll("tbody tr")).sort(comparer(Array.from(heading.parentNode.children).indexOf(heading), sortAsc));
                _this.rehydrateTable(sortedData);
            }, false);
        });
    };
    Table.prototype.getCellValue = function (tr, idx) {
        var tableData = tr.children[idx];
        var returnValue;
        returnValue = tableData.hasAttribute("data-sort-raw") ? tableData.getAttribute("data-raw-value") : tableData.innerText || tableData.textContent;
        returnValue = tableData.hasAttribute("data-strip-chars") ? returnValue.replace(/\D/g, '') : returnValue;
        returnValue = tableData.hasAttribute("data-sort-int") ? parseInt(returnValue) : returnValue.toString();
        return returnValue;
    };
    Table.prototype.rehydrateTable = function (tableData) {
        var tBody = this.table.querySelector("tbody");
        tableData.forEach(function (tableRow) {
            tBody.appendChild(tableRow);
        });
    };
    return Table;
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
    MoneyTotals.prototype.getHistory = function () {
        var totalAmount = 0;
        Database.fetchAllRowsFromTable(this.db, "transactions", function (idbRequest) {
            var currentDate = new Date();
            var tbody = document.querySelector("#activityLogTable tbody");
            tbody.innerHTML = "";
            idbRequest.result.forEach(function (transaction) {
                if (currentDate.getFullYear() == transaction.date.getFullYear() && currentDate.getMonth() == transaction.date.getMonth()) {
                    totalAmount += transaction.amount;
                    transaction.amount = transaction.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    transaction.date = months[transaction.date.getMonth()] + "-" + transaction.date.getDate();
                    var logRow_1 = document.getElementById("logRow").content.cloneNode(true);
                    Object.entries(transaction).forEach(function (key) {
                        var cellToUpdate = logRow_1.querySelector("[data-" + key[0] + "]");
                        if (cellToUpdate != null) {
                            cellToUpdate.innerText = key[1];
                        }
                    });
                    tbody.appendChild(logRow_1);
                }
            });
            document.getElementById("logTotal").innerText = totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        this.pageTitle = this.screenElement.getAttribute("data-screen-title") == undefined ? null : this.screenElement.getAttribute("data-screen-title");
    }
    AppScreen.prototype.init = function () {
        this.attachCloseListeners();
        this.attachOpenListeners();
    };
    AppScreen.prototype.attachCloseListeners = function () {
        var _this = this;
        var closeButtons = this.screenElement.querySelectorAll("[data-close]");
        closeButtons.forEach(function (button) {
            button.addEventListener("touchstart", function () { return _this.closeScreen(); }, false);
        });
    };
    AppScreen.prototype.attachOpenListeners = function () {
        var _this = this;
        var openButtons = document.querySelectorAll("[data-opens-screen=\"" + this.screenId + "\"]");
        openButtons.forEach(function (button) {
            button.addEventListener("touchstart", function () { return _this.openScreen(); }, false);
        });
    };
    AppScreen.prototype.closeScreen = function () {
        this.screenElement.setAttribute("aria-hidden", "true");
        if (this.screenElement.classList.contains("half")) {
            document.getElementById("dashScreen").removeAttribute("aria-hidden");
        }
        this.blackBackground.classList.remove("shown");
        this.blackBackground.removeEventListener("touchstart", this.clickedOnBackground);
        this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox]), select").forEach(function (input) {
            input.blur();
            input.value = "";
            var inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(inputEvent);
        });
    };
    AppScreen.prototype.openScreen = function () {
        if (this.screenElement.classList.contains("half")) {
            this.blackBackground.classList.add("shown");
        }
        else {
            document.querySelectorAll(".screen").forEach(function (screen) { return screen.setAttribute("aria-hidden", "true"); });
        }
        if (this.pageTitle != null) {
            document.querySelector("#mainHeader h1").innerText = this.pageTitle;
        }
        this.screenElement.removeAttribute("aria-hidden");
        this.blackBackground.addEventListener("touchstart", this.clickedOnBackground.bind(this), false);
    };
    AppScreen.prototype.clickedOnBackground = function (ev) {
        if (ev.target == this.blackBackground) {
            this.closeScreen();
        }
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
            totalCalc.getHistory();
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
        document.querySelectorAll("#mainNav [data-opens-screen]").forEach(function (button) {
            button.addEventListener("touchend", function () { return _this.closeFlyout(); }, false);
        });
    };
    MobileNav.prototype.openFlyout = function () {
        this.blackBackground.classList.add("shown");
        this.blackBackground.addEventListener("touchstart", this.closeFlyout.bind(this), false);
        this.navSlideout.removeAttribute("aria-hidden");
    };
    MobileNav.prototype.closeFlyout = function () {
        this.blackBackground.removeEventListener("touchstart", this.closeFlyout);
        this.blackBackground.classList.remove("shown");
        this.navSlideout.setAttribute("aria-hidden", "true");
    };
    return MobileNav;
}());
document.querySelector("body").addEventListener("touchstart", function () { }, { passive: true });
var nav = new MobileNav();
nav.addListeners();
var addScreen = new AppScreen("addNewEntryScreen");
addScreen.init();
var logScreen = new AppScreen("logScreen");
logScreen.init();
var homeScreen = new AppScreen("dashScreen");
homeScreen.init();
var logTable = new Table("#activityLogTable");
logTable.initSort();
var db = new Database(function (db) {
    var totals = new MoneyTotals(db);
    totals.calculate();
    totals.getHistory();
    var newEntry = new AddNewEntry(db, addScreen);
    newEntry.init(totals);
});
