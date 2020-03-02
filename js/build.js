var AppScreen = (function () {
    function AppScreen(pageId) {
        this.screenId = pageId;
        this.screenElement = document.getElementById(pageId);
        if (this.screenElement == null) {
            throw "Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";
        }
        this.init();
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
    };
    AppScreen.prototype.openScreen = function () {
        this.screenElement.removeAttribute("aria-hidden");
    };
    return AppScreen;
}());
document.querySelector("body").addEventListener("touchstart", function () { }, { passive: true });
var addScreen = new AppScreen("addNewEntryScreen");
