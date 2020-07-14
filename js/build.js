var Database=function(){function n(t){this.idb=indexedDB||window.indexedDB,this.dbName="money";try{this.dbReq=this.idb.open(this.dbName,1)}catch(t){return void n.dataNotSupported(t)}this.successFunction=t,this.requestHandlers()}return n.prototype.requestHandlers=function(){var e=this;this.dbReq.onerror=function(t){return n.dataNotSupported(t)},this.dbReq.onsuccess=function(t){e.setDb(),e.successFunction(e.db)},this.dbReq.onupgradeneeded=function(t){return e.seedDb()}},n.prototype.seedDb=function(){this.setDb();try{this.transactionTable()}catch(t){}},n.prototype.setDb=function(){this.db=void 0===this.db?this.dbReq.result:this.db,this.db.onerror=function(t){return n.dataNotSupported(t)}},n.prototype.transactionTable=function(){var t=this.db.createObjectStore("transactions",{keyPath:"transactionId",autoIncrement:!0});t.createIndex("name","name"),t.createIndex("type","type")},n.insert=function(t,e,n,o,r){var a=t.transaction([e],"readwrite").objectStore(e).add(o);a.onsuccess=function(t){r(a)}},n.fetchAllRowsFromTable=function(t,e,n,o){void 0===o&&(o=function(){return console.log("Error")});var r=t.transaction([e]).objectStore(e).getAll();r.onerror=function(t){console.log("errored out")},r.onsuccess=function(t){n(r)}},n.fetchRowFromDatabase=function(t,e,n,o,r){var a=t.transaction([e],"readwrite").objectStore(e).get(n);a.onerror=function(t){console.log("this is an error"),console.log(t)},a.onsuccess=function(t){void 0===a?r(a):o(a)}},n.deleteFromDatabase=function(t,e,n,o){var r=t.transaction([e],"readwrite").objectStore(e).delete(n);r.onsuccess=function(t){o(r)},r.onerror=function(t){console.log(t)}},n.dataNotSupported=function(t){console.log("For some reason, whatever action you just took, wasn't supported"),null!=t&&console.log(t)},n}(),MoneyTotals=function(){function t(t){this.db=t}return t.prototype.calculate=function(){var n=0;Database.fetchAllRowsFromTable(this.db,"transactions",function(t){var e=new Date;t.result.forEach(function(t){e.getFullYear()==t.date.getFullYear()&&e.getMonth()==t.date.getMonth()&&(n+=t.amount)}),document.getElementById("mainMoneyShow").innerText=n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")})},t.prototype.getHistory=function(){var o=0;Database.fetchAllRowsFromTable(this.db,"transactions",function(t){var e=new Date;t.result.forEach(function(t){if(e.getFullYear()==t.date.getFullYear()&&e.getMonth()==t.date.getMonth()){o+=t.amount,t.amount=t.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,","),t.date=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.date.getMonth()]+"-"+t.date.getDate();var n=document.getElementById("logRow").content.cloneNode(!0);Object.entries(t).forEach(function(t){var e=n.querySelector("[data-"+t[0]+"]");null!=e&&(e.innerText=t[1])}),document.querySelector("#activityLogTable tbody").appendChild(n)}}),document.getElementById("logTotal").innerText=o.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")})},t}(),AppScreen=function(){function t(t){if(this.blackBackground=document.getElementById("opaqueBlackBackground"),this.screenId=t,this.screenElement=document.getElementById(t),null==this.screenElement)throw"Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";this.pageTitle=null==this.screenElement.getAttribute("data-screen-title")?null:this.screenElement.getAttribute("data-screen-title")}return t.prototype.init=function(){this.attachCloseListeners(),this.attachOpenListeners()},t.prototype.attachCloseListeners=function(){var e=this;this.screenElement.querySelectorAll("[data-close]").forEach(function(t){t.addEventListener("touchstart",function(){return e.closeScreen()},!1)})},t.prototype.attachOpenListeners=function(){var e=this;document.querySelectorAll('[data-opens-screen="'+this.screenId+'"]').forEach(function(t){t.addEventListener("touchstart",function(){return e.openScreen()},!1)})},t.prototype.closeScreen=function(){this.screenElement.setAttribute("aria-hidden","true"),this.screenElement.classList.contains("half")&&document.getElementById("dashScreen").removeAttribute("aria-hidden"),this.blackBackground.classList.remove("shown"),this.blackBackground.removeEventListener("touchstart",this.clickedOnBackground),this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox]), select").forEach(function(t){t.blur(),t.value="";var e=new Event("input",{bubbles:!0,cancelable:!0});t.dispatchEvent(e)})},t.prototype.openScreen=function(){this.screenElement.classList.contains("half")?this.blackBackground.classList.add("shown"):document.querySelectorAll(".screen").forEach(function(t){return t.setAttribute("aria-hidden","true")}),null!=this.pageTitle&&(document.querySelector("#mainHeader h1").innerText=this.pageTitle),this.screenElement.removeAttribute("aria-hidden"),this.blackBackground.addEventListener("touchstart",this.clickedOnBackground.bind(this),!1)},t.prototype.clickedOnBackground=function(t){t.target==this.blackBackground&&this.closeScreen()},t}(),AddNewEntry=function(){function t(t,e){this.newEntryInput=document.getElementById("addNewValue"),this.nameEntryInput=document.getElementById("nameOfPurchase"),this.addEntryButton=document.getElementById("addNewEntryButton"),this.typeSelection=document.getElementById("entrySelection"),this.form=document.getElementById("addEntryForm"),this.db=t,this.addScreen=e}return t.prototype.init=function(t){var e=this;this.newEntryInput.addEventListener("input",function(){return e.toggleButtonAbility()},!1),this.nameEntryInput.addEventListener("input",function(){return e.toggleButtonAbility()},!1),this.typeSelection.addEventListener("change",function(){return e.toggleButtonAbility()},!1),this.addEntryButton.addEventListener("click",function(){return e.addEntry(t)},!1)},t.prototype.toggleButtonAbility=function(){this.form.checkValidity()?this.addEntryButton.removeAttribute("disabled"):this.addEntryButton.setAttribute("disabled","true")},t.prototype.addEntry=function(e){var n=this,t=parseFloat(this.newEntryInput.value);Database.insert(this.db,"transactions","transactionId",{amount:t,type:this.typeSelection.value,name:this.nameEntryInput.value,date:new Date},function(t){t.result,e.calculate(),n.addScreen.closeScreen()})},t}(),MobileNav=function(){function t(){this.blackBackground=document.getElementById("opaqueBlackBackground"),this.hamburgerMenu=document.getElementById("navSwitcher"),this.navSlideout=document.getElementById("mainNav")}return t.prototype.addListeners=function(){var e=this;this.hamburgerMenu.addEventListener("touchstart",function(){return e.openFlyout()},!1),this.navSlideout.addEventListener("touchstart",function(t){t.target==e.navSlideout&&e.closeFlyout()},!1),document.querySelectorAll("#mainNav [data-opens-screen]").forEach(function(t){t.addEventListener("touchend",function(){return e.closeFlyout()},!1)})},t.prototype.openFlyout=function(){this.blackBackground.classList.add("shown"),this.blackBackground.addEventListener("touchstart",this.closeFlyout.bind(this),!1),this.navSlideout.removeAttribute("aria-hidden")},t.prototype.closeFlyout=function(){this.blackBackground.removeEventListener("touchstart",this.closeFlyout),this.blackBackground.classList.remove("shown"),this.navSlideout.setAttribute("aria-hidden","true")},t}();document.querySelector("body").addEventListener("touchstart",function(){},{passive:!0});var nav=new MobileNav;nav.addListeners();var addScreen=new AppScreen("addNewEntryScreen");addScreen.init();var logScreen=new AppScreen("logScreen");logScreen.init();var homeScreen=new AppScreen("dashScreen");homeScreen.init();var db=new Database(function(t){var e=new MoneyTotals(t);e.calculate(),e.getHistory(),new AddNewEntry(t,addScreen).init(e)});