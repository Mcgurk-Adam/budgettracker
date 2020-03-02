class AppScreen {

	screenId:string;
	screenElement:HTMLElement;

	constructor(pageId:string) {

		this.screenId = pageId;
		this.screenElement = document.getElementById("pageId");

		if (this.screenElement == null) {
			throw "Sorry, there is not an element on this page with that ID, therefore, the screen doesn't exist";
		}

		this.init();

	}

	private init(): void {

		this.attachCloseListeners();
		this.attachOpenListeners();

	}

	private attachCloseListeners(): void {

		const closeButtons:NodeListOf<HTMLElement> = this.screenElement.querySelectorAll("[data-close]");
		closeButtons.forEach((button:HTMLElement) => {

			button.addEventListener("click", this.closeScreen, false);

		});

	}

	private attachOpenListeners(): void {

		const openButtons:NodeListOf<HTMLElement> = document.querySelectorAll(`[data-opens-screen="${this.screenId}"]`);
		openButtons.forEach((button:HTMLElement) => {

			button.addEventListener("click", this.openScreen, false);

		});

	}

	public closeScreen(): void {
		this.screenElement.setAttribute("aria-hidden", "true");
	}

	public openScreen(): void {
		this.screenElement.removeAttribute("aria-hidden");
	}

}
