class Table {

	private table:HTMLTableElement;

	constructor(tableQuery:string) {
		this.table = document.querySelector(tableQuery);
	}

	initSort(): void {

		const headings:NodeListOf<HTMLTableHeaderCellElement> = this.table.querySelectorAll("thead th:not([data-no-sort])");
		headings.forEach((heading:HTMLTableHeaderCellElement) => {

			heading.addEventListener("touchstart", () => {

				// this is for when someone changes headings they want to sort by
				headings.forEach((head:HTMLTableHeaderCellElement) => {
					if (head != heading) {
						head.classList.remove("sorting");
						head.removeAttribute("data-order-by");
					}
				});

				// add the class and HTML attribute if necessary
				heading.classList.add("sorting");
				const direction:string = heading.getAttribute("data-order-by") == null || heading.getAttribute("data-order-by") == "ASC" ? "DESC" : "ASC";
				heading.setAttribute("data-order-by", direction);

				const sortAsc:boolean = direction == "ASC" ? true : false;

				// do the actual sorting
				const comparer = (idx, asc) => (a, b) => ((v1:any, v2:any) => 
				    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
				    )(this.getCellValue(asc ? a : b, idx), this.getCellValue(asc ? b : a, idx));

				// @ts-ignore - from does exist
				const sortedData:Array<HTMLTableRowElement> = Array.from(this.table.querySelectorAll("tbody tr")).sort(comparer(Array.from(heading.parentNode.children).indexOf(heading), sortAsc));
				this.rehydrateTable(sortedData);

			}, {passive: true});

		});

	}

	private getCellValue(tr:HTMLDivElement, idx:number):string|number {
		
		const tableData:HTMLElement = tr.children[idx] as HTMLElement;

		let returnValue:string|number;

		returnValue = tableData.hasAttribute("data-sort-raw") ? tableData.getAttribute("data-raw-value") : tableData.innerText || tableData.textContent;
		returnValue = tableData.hasAttribute("data-strip-chars") ? returnValue.replace(/\D/g,'') : returnValue;
		returnValue = tableData.hasAttribute("data-sort-int") ? parseInt(returnValue) : returnValue.toString();

		return returnValue;

	}

	private rehydrateTable(tableData:Array<HTMLDivElement>): void {

		const tBody:HTMLDivElement = this.table.querySelector("tbody");

		tableData.forEach((tableRow:HTMLDivElement) => {
			tBody.appendChild(tableRow);
		});

	}

}
