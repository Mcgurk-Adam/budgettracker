class AppScreen {

	screenId:string;
	screenElement:HTMLElement;
	blackBackground:HTMLDivElement;
	pageTitle:string|null;
	closeClickedOnBackground:boolean

	constructor(pageId:string, closeClickOnBackground:boolean = false) {

		this.blackBackground = document.getElementById("opaqueBlackBackground") as HTMLDivElement;
		this.screenId = pageId;
		this.screenElement = document.getElementById(pageId);

		if (this.screenElement == null) {
			throw "Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";
		}

		this.pageTitle = this.screenElement.getAttribute("data-screen-title") == undefined ? null : this.screenElement.getAttribute("data-screen-title");
		this.closeClickedOnBackground = closeClickOnBackground;

	}

	init(): void {

		this.attachCloseListeners();
		this.attachOpenListeners();

	}

	private attachCloseListeners(): void {

		const closeButtons:NodeListOf<HTMLElement> = this.screenElement.querySelectorAll("[data-close]");
		closeButtons.forEach((button:HTMLElement) => {

			button.addEventListener("touchstart", () => this.closeScreen(), {passive: true});

		});

	}

	private attachOpenListeners(): void {

		const openButtons:NodeListOf<HTMLElement> = document.querySelectorAll(`[data-opens-screen="${this.screenId}"]`);
		openButtons.forEach((button:HTMLElement) => {

			button.addEventListener("touchstart", () => this.openScreen(), {passive: true});

		});

	}

	closeScreen(): void {
		this.screenElement.setAttribute("aria-hidden", "true");
		if (this.screenElement.classList.contains("half")) {
			document.getElementById("dashScreen").removeAttribute("aria-hidden");
		}
		this.blackBackground.classList.remove("shown");
		if (this.closeClickedOnBackground) {
			this.blackBackground.removeEventListener("touchstart", this.clickedOnBackground);
		}
		this.screenElement.querySelectorAll("input:not([type=radio]):not([type=checkbox]), select").forEach((input:HTMLInputElement|HTMLSelectElement) => {

			input.blur();

			input.value = "";
			const inputEvent:Event = new Event("input", {
				bubbles: true,
				cancelable: true
			});
			input.dispatchEvent(inputEvent);

		});

	}

	openScreen(): void {

		if (this.screenElement.classList.contains("half")) {

			this.blackBackground.classList.add("shown");

		} else {
			document.querySelectorAll(".screen").forEach((screen:HTMLElement) => screen.setAttribute("aria-hidden", "true"));
		}

		if (this.pageTitle != null) {
			// @ts-ignore
			document.querySelector("#mainHeader h1").innerText = this.pageTitle;

		}

		this.screenElement.removeAttribute("aria-hidden");
		if (this.closeClickedOnBackground) {
			this.blackBackground.addEventListener("touchstart", this.clickedOnBackground.bind(this), {passive: true});
		}

	}

	clickedOnBackground(ev:MouseEvent): void {

		if (ev.target == this.blackBackground) {
			this.closeScreen();
		}

	}

}
