class MobileNav {

	private hamburgerMenu:HTMLButtonElement;
	private navSlideout:HTMLElement;

	constructor() {

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

		this.navSlideout.removeAttribute("aria-hidden");

	}

	closeFlyout(): void {

		this.navSlideout.setAttribute("aria-hidden", "true");

	}

}