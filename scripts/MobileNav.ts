class MobileNav {

	private hamburgerMenu:HTMLButtonElement;
	private navSlideout:HTMLElement;
	private blackBackground:HTMLDivElement;

	constructor() {

		this.blackBackground = document.getElementById("opaqueBlackBackground") as HTMLDivElement;
		this.hamburgerMenu = document.getElementById("navSwitcher") as HTMLButtonElement;
		this.navSlideout = document.getElementById("mainNav");

	}

	addListeners(): void {

		this.hamburgerMenu.addEventListener("click", () => this.openFlyout(), false);
		this.navSlideout.addEventListener("click", (ev:MouseEvent) => {

			if (ev.target == this.navSlideout) {

				this.closeFlyout();

			}

		}, false);

	}

	openFlyout(): void {

		this.blackBackground.style.visibility = "visible";
		this.blackBackground.classList.add("shown");
		this.blackBackground.addEventListener("click", this.closeFlyout.bind(this), false);
		this.navSlideout.removeAttribute("aria-hidden");

	}

	closeFlyout(): void {

		this.blackBackground.removeEventListener("click", this.closeFlyout);
		this.blackBackground.classList.remove("shown");
		this.blackBackground.addEventListener("transitionend", AppScreen.changeBackToHidden, false);
		this.navSlideout.setAttribute("aria-hidden", "true");

	}

}