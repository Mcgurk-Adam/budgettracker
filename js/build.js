var Database=function(){function n(t){this.idb=indexedDB||window.indexedDB,this.dbName="money",this.keyPathString="transactionId";try{this.dbReq=this.idb.open(this.dbName,1)}catch(t){return void n.dataNotSupported(t)}this.successFunction=t,this.requestHandlers()}return n.prototype.requestHandlers=function(){var e=this;this.dbReq.onerror=function(t){return n.dataNotSupported(t)},this.dbReq.onsuccess=function(t){e.setDb(),e.successFunction(e.db)},this.dbReq.onupgradeneeded=function(t){return e.seedDb()}},n.prototype.seedDb=function(){this.setDb();try{this.transactionTable()}catch(t){}},n.prototype.setDb=function(){this.db=void 0===this.db?this.dbReq.result:this.db,this.db.onerror=function(t){return n.dataNotSupported(t)}},n.prototype.transactionTable=function(){var t=this.db.createObjectStore("transactions",{keyPath:this.keyPathString,autoIncrement:!0});t.createIndex("name","name"),t.createIndex("type","type")},n.insert=function(t,e,n,o,r){var a=t.transaction([e],"readwrite").objectStore(e).add(o);a.onsuccess=function(t){r(a)}},n.updateRow=function(t,e,n,r,a){t.transaction([e],"readwrite").objectStore(e).openCursor(n).onsuccess=function(t){var e=event.target.result,n=e.value;if(e){Object.entries(n).forEach(function(t){var e=t[0];if(t[1],"transactionId"!=e){if(null==r[e])throw"The object passed doesn't have all of the keys necessary. Specifically, it's missing: "+e;n[e]=r[e]}});var o=e.update(n);o.onsuccess=function(t){a(o)}}}},n.fetchAllRowsFromTable=function(t,e,n,o){void 0===o&&(o=function(){return console.log("Error")});var r=t.transaction([e]).objectStore(e).getAll();r.onerror=function(t){console.log("errored out")},r.onsuccess=function(t){n(r)}},n.fetchRowFromDatabase=function(t,e,n,o,r){var a=t.transaction([e],"readwrite").objectStore(e).get(n);a.onerror=function(t){console.log("this is an error"),console.log(t)},a.onsuccess=function(t){void 0===a?r(a):o(a)}},n.deleteFromDatabase=function(t,e,n,o){var r=t.transaction([e],"readwrite").objectStore(e).delete(n);r.onsuccess=function(t){o(r)},r.onerror=function(t){console.log(t)}},n.dataNotSupported=function(t){console.log("For some reason, whatever action you just took, wasn't supported"),null!=t&&console.log(t)},n}(),Table=function(){function t(t){this.table=document.querySelector(t)}return t.prototype.initSort=function(){var i=this,c=this.table.querySelectorAll("thead th:not([data-no-sort])");c.forEach(function(o){o.addEventListener("touchstart",function(){c.forEach(function(t){t!=o&&(t.classList.remove("sorting"),t.removeAttribute("data-order-by"))}),o.classList.add("sorting");var t=null==o.getAttribute("data-order-by")||"ASC"==o.getAttribute("data-order-by")?"DESC":"ASC";o.setAttribute("data-order-by",t);var r,a,e="ASC"==t,n=Array.from(i.table.querySelectorAll("tbody tr")).sort((r=Array.from(o.parentNode.children).indexOf(o),a=e,function(t,e){return n=i.getCellValue(a?t:e,r),o=i.getCellValue(a?e:t,r),""===n||""===o||isNaN(n)||isNaN(o)?n.toString().localeCompare(o):n-o;var n,o}));i.rehydrateTable(n)},{passive:!0})})},t.prototype.getCellValue=function(t,e){var n,o=t.children[e];return n=o.hasAttribute("data-sort-raw")?o.getAttribute("data-raw-value"):o.innerText||o.textContent,n=o.hasAttribute("data-strip-chars")?n.replace(/\D/g,""):n,o.hasAttribute("data-sort-int")?parseInt(n):n.toString()},t.prototype.rehydrateTable=function(t){var e=this.table.querySelector("tbody");t.forEach(function(t){e.appendChild(t)})},t}(),MoneyTotals=function(){function t(t){this.db=t}return t.prototype.calculate=function(){var n=0;Database.fetchAllRowsFromTable(this.db,"transactions",function(t){var e=new Date;t.result.forEach(function(t){e.getFullYear()==t.date.getFullYear()&&e.getMonth()==t.date.getMonth()&&(n+=t.amount)}),document.getElementById("mainMoneyShow").innerText=n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")})},t.prototype.getHistory=function(){var r=this,a=0;Database.fetchAllRowsFromTable(this.db,"transactions",function(t){var e=new Date,o=document.querySelector("#activityLogTable tbody");o.innerHTML="",t.result.forEach(function(t){if(e.getFullYear()==t.date.getFullYear()&&e.getMonth()==t.date.getMonth()){var n=document.getElementById("logRow").content.cloneNode(!0);n.querySelector("[data-amount]").setAttribute("data-raw-value",t.amount.toString()),a+=t.amount,t.amount=t.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,","),t.date=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.date.getMonth()]+"-"+t.date.getDate(),Object.entries(t).forEach(function(t){var e=n.querySelector("[data-"+t[0]+"]");null!=e&&(e.innerText=t[1])}),n.querySelector(".trash").addEventListener("touchstart",function(){window.confirm("Are you sure you want to delete this transaction?")&&Database.deleteFromDatabase(r.db,"transactions",t.transactionId,function(){r.calculate(),r.getHistory()})},{passive:!0}),n.querySelector(".edit").addEventListener("touchstart",function(){Database.fetchRowFromDatabase(r.db,"transactions",t.transactionId,function(t){t.result,document.getElementById("editLogEntryModal").removeAttribute("aria-hidden")},function(){return console.log("Not able to fetch")})},{passive:!0}),o.appendChild(n)}}),document.getElementById("logTotal").innerText=a.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")})},t}(),AppScreen=function(){function t(t,e){if(void 0===e&&(e=!1),this.blackBackground=document.getElementById("opaqueBlackBackground"),this.screenId=t,this.screenElement=document.getElementById(t),null==this.screenElement)throw"Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";this.pageTitle=null==this.screenElement.getAttribute("data-screen-title")?null:this.screenElement.getAttribute("data-screen-title"),this.closeClickedOnBackground=e}return t.prototype.init=function(){this.attachCloseListeners(),this.attachOpenListeners()},t.prototype.attachCloseListeners=function(){var e=this;this.screenElement.querySelectorAll("[data-close]").forEach(function(t){t.addEventListener("touchstart",function(){return e.closeScreen()},{passive:!0})})},t.prototype.attachOpenListeners=function(){var e=this;document.querySelectorAll('[data-opens-screen="'+this.screenId+'"]').forEach(function(t){t.addEventListener("touchstart",function(){return e.openScreen()},{passive:!0})})},t.prototype.closeScreen=function(){this.screenElement.setAttribute("aria-hidden","true"),this.screenElement.classList.contains("half")&&document.getElementById("dashScreen").removeAttribute("aria-hidden"),this.blackBackground.classList.remove("shown"),this.closeClickedOnBackground&&this.blackBackground.removeEventListener("touchstart",this.clickedOnBackground),this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox]), select").forEach(function(t){t.blur(),t.value="";var e=new Event("input",{bubbles:!0,cancelable:!0});t.dispatchEvent(e)})},t.prototype.openScreen=function(){this.screenElement.classList.contains("half")?this.blackBackground.classList.add("shown"):document.querySelectorAll(".screen").forEach(function(t){return t.setAttribute("aria-hidden","true")}),null!=this.pageTitle&&(document.querySelector("#mainHeader h1").innerText=this.pageTitle),this.screenElement.removeAttribute("aria-hidden"),this.closeClickedOnBackground&&this.blackBackground.addEventListener("touchstart",this.clickedOnBackground.bind(this),{passive:!0})},t.prototype.clickedOnBackground=function(t){t.target==this.blackBackground&&this.closeScreen()},t}(),AddNewEntry=function(){function t(t,e){this.newEntryInput=document.getElementById("addNewValue"),this.nameEntryInput=document.getElementById("nameOfPurchase"),this.addEntryButton=document.getElementById("addNewEntryButton"),this.typeSelection=document.getElementById("entrySelection"),this.form=document.getElementById("addEntryForm"),this.db=t,this.addScreen=e}return t.prototype.init=function(t){var e=this;this.newEntryInput.addEventListener("input",function(){return e.toggleButtonAbility()},!1),this.nameEntryInput.addEventListener("input",function(){return e.toggleButtonAbility()},!1),this.typeSelection.addEventListener("change",function(){return e.toggleButtonAbility()},!1),this.addEntryButton.addEventListener("click",function(){return e.addEntry(t)},!1)},t.prototype.toggleButtonAbility=function(){this.form.checkValidity()?this.addEntryButton.removeAttribute("disabled"):this.addEntryButton.setAttribute("disabled","true")},t.prototype.addEntry=function(e){var n=this,t=parseFloat(this.newEntryInput.value);Database.insert(this.db,"transactions","transactionId",{amount:t,type:this.typeSelection.value,name:this.nameEntryInput.value,date:new Date},function(t){t.result,e.calculate(),e.getHistory(),n.addScreen.closeScreen()})},t}(),MobileNav=function(){function t(){this.blackBackground=document.getElementById("opaqueBlackBackground"),this.hamburgerMenu=document.getElementById("navSwitcher"),this.navSlideout=document.getElementById("mainNav")}return t.prototype.addListeners=function(){var e=this;this.hamburgerMenu.addEventListener("touchstart",function(){return e.openFlyout()},{passive:!0}),this.navSlideout.addEventListener("touchstart",function(t){t.target==e.navSlideout&&e.closeFlyout()},{passive:!0}),document.querySelectorAll("#mainNav [data-opens-screen]").forEach(function(t){t.addEventListener("touchend",function(){return e.closeFlyout()},!1)})},t.prototype.openFlyout=function(){this.blackBackground.classList.add("shown"),this.blackBackground.addEventListener("touchstart",this.closeFlyout.bind(this),!1),this.navSlideout.removeAttribute("aria-hidden")},t.prototype.closeFlyout=function(){this.blackBackground.removeEventListener("touchstart",this.closeFlyout),this.blackBackground.classList.remove("shown"),this.navSlideout.setAttribute("aria-hidden","true")},t}();"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").then(function(t){console.log("New SW reg",t.scope)},function(t){console.log("ServiceWorker registration failed: ",t)})}),document.querySelector("body").addEventListener("touchstart",function(){},{passive:!0});var nav=new MobileNav;nav.addListeners();var addScreen=new AppScreen("addNewEntryScreen",!0);addScreen.init();var logScreen=new AppScreen("logScreen");logScreen.init();var homeScreen=new AppScreen("dashScreen");homeScreen.init();var logTable=new Table("#activityLogTable");logTable.initSort();var db=new Database(function(t){var e=new MoneyTotals(t);e.calculate(),e.getHistory(),new AddNewEntry(t,addScreen).init(e)}),reloadButton=document.querySelector("[data-performs-action='reload']");function reloadApp(){window.navigator&&navigator.serviceWorker&&navigator.serviceWorker.getRegistrations().then(function(t){return t.forEach(function(t){return t.unregister()})}),document.location.reload(!0)}reloadButton.addEventListener("touchend",reloadApp,!1);