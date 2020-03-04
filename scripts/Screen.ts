class AppScreen {

	screenId:string;
	screenElement:HTMLElement;
	blackBackground:HTMLDivElement;

	constructor(pageId:string) {

		this.blackBackground = document.getElementById("opaqueBlackBackground") as HTMLDivElement;
		this.screenId = pageId;
		this.screenElement = document.getElementById(pageId);

		if (this.screenElement == null) {
			throw "Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";
		}

	}

	init(): void {

		this.attachCloseListeners();
		this.attachOpenListeners();

	}

	private attachCloseListeners(): void {

		const closeButtons:NodeListOf<HTMLElement> = this.screenElement.querySelectorAll("[data-close]");
		closeButtons.forEach((button:HTMLElement) => {

			button.addEventListener("click", () => this.closeScreen(), false);

		});

	}

	private attachOpenListeners(): void {

		const openButtons:NodeListOf<HTMLElement> = document.querySelectorAll(`[data-opens-screen="${this.screenId}"]`);
		openButtons.forEach((button:HTMLElement) => {

			button.addEventListener("click", () => this.openScreen(), false);

		});

	}

	closeScreen(): void {
		this.screenElement.setAttribute("aria-hidden", "true");
		this.blackBackground.classList.remove("shown");
		this.blackBackground.addEventListener("transitionend", AppScreen.changeBackToHidden, false);
		this.blackBackground.removeEventListener("click", this.clickedOnBackground);
		this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox])").forEach((input:HTMLInputElement) => {

			input.value = "";
			const inputEvent:Event = new Event("input", {
				bubbles: true,
				cancelable: true
			});
			input.dispatchEvent(inputEvent);

		});

	}

	openScreen(): void {
		this.blackBackground.style.visibility = "visible";
		this.blackBackground.classList.add("shown");
		this.screenElement.removeAttribute("aria-hidden");
		this.blackBackground.addEventListener("click", this.clickedOnBackground.bind(this), false);
	}

	clickedOnBackground(ev:MouseEvent): void {

		if (ev.target == this.blackBackground) {
			this.closeScreen();
		}

	}

	static changeBackToHidden(): void {

		this.style.visibility = "hidden";
		this.removeEventListener("transitionend", AppScreen.changeBackToHidden);

	}

}
