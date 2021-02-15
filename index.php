<?php include_once 'view/html/includes/head.php'; ?>

<body>

	<div id="opaqueBlackBackground"></div>

	<main>

		<nav id="mainNav" aria-hidden="true">

			<ul>

				<img src="/assets/nav-image.svg" alt="A green circle with a dollar sign and words saying 'Count Cash'" title="Count Cash"> <!-- lang-string -->
				<button type="button" data-opens-screen="dashScreen" title="Home Navigation Button" name="Home Navigation Button">Home</button> <!-- lang-string -->
				<button type="button" data-opens-screen="logScreen" title="Activity Navigation Button" name="Activity Navigation Button">Activity</button> <!-- lang-string -->
				<button type="button" data-performs-action="reload" title="Reload App Button" name="Reload App Button">Reload</button> <!-- lang-string -->
			
			</ul>

		</nav>

		<header id="mainHeader">

			<button id="navSwitcher" title="Switch Navigation" name="Switch Navigation"></button> <!-- lang-string -->
			<h1>Home</h1> <!-- lang-string -->
			<div class="clearfix"></div>

		</header>

		<section class="screen full no-animation" id="dashScreen" data-screen-title="Home"> <!-- lang-string -->

			<div class="base">
				
				<h1 id="mainMoneyShow">0.00</h1>
				<p>Spent this month</p> <!-- lang-string -->

			</div>
			
			<button type="button" class="add circle green pressed-animation" id="addNewEntry" data-opens-screen="addNewEntryScreen" title="Add New Budget Entry" name="Add New Budget Entry"></button> <!-- lang-string -->

		</section>

		<section class="screen full no-animation" id="logScreen" data-screen-title="Activity" aria-hidden> <!-- lang-string -->

			<div data-modal aria-hidden id="editLogEntryModal">
				
				<header>

					<div class="clearfix"></div>
					<h1>Edit</h1> <!-- lang-string -->
					<button type="button" class="pressed-animation" data-close-modal></button>

				</header>

				<form class="body">

					<label class="top-down">Transaction Name <!-- lang-string -->

						<input type="text" id="editTransactionName" data-column="name" spellcheck="false" required>

					</label>

					<label class="top-down">Transaction Type

						<select id="editTransactionType" data-column="type" required>

							<option value="" disabled selected>Select the type</option> <!-- lang-string -->
							<option value="Food">Food</option> <!-- lang-string -->
							<option value="Clothes">Clothes</option> <!-- lang-string -->
							<option value="Tech">Tech</option> <!-- lang-string -->
							<option value="Games">Games</option> <!-- lang-string -->
							<option value="Entertainment">Entertainment</option> <!-- lang-string -->
							<option value="Other">Other</option> <!-- lang-string -->

						</select>

					</label>

					<label class="dollar-input w-95">

						$ <input type="number" data-column="amount" id="editTransactionAmount" inputmode="decimal" step=".01" required>

					</label>

					<label class="top-down">Transaction Date/Time <!-- lang-string -->

						<input type="datetime-local" data-column="date" id="editTransactionTime" step="any" style="min-width: 95%;" required>

					</label>

					<input type="hidden" id="editTransactionId" required>

				</form>

				<footer>

					<button type="button" class="gray modal-action" data-close-modal>Close</button> <!-- lang-string -->
					<button type="button" class="green modal-action" data-save>Save</button> <!-- lang-string -->

				</footer>

			</div>

			<table id="activityLogTable">
				
				<thead>
					
					<tr>

						<th style="width: 33%;">Name</th> <!-- lang-string -->
						<th data-no-sort style="width: 20%;">Date</th> <!-- lang-string -->
						<th style="width: 20%;">Amount</th> <!-- lang-string -->
						<th style="width: 27%;"></th> <!-- lang-string -->
					
					</tr>

				</thead>

				<tbody></tbody>

				<tfoot>

					<tr class="three">
						<td class="bold" style="width: 53%;">Total:</td> <!-- lang-string -->
						<td id="logTotal" class="dollar" style="width: 47%;"></td>
					</tr>

				</tfoot>

			</table>

		</section>

		<template id="logRow">
			
			<tr>
				
				<td style="width: 33%;" data-name></td>
				<td style="width: 20%;" data-date></td>
				<td style="width: 20%;" data-amount class="dollar" data-sort-raw></td>
				<td style="width: 27%;" class="actions">
					
					<button type="button" class="icon edit"></button>
					<button type="button" class="icon trash"></button>

				</td>

			</tr>

		</template>

		<section class="screen white from-bottom half" id="addNewEntryScreen" aria-hidden="true">
			
			<header>
				
				<button class="pressed-animation" name="Close the entry screen" title="Close the entry screen" data-close></button> <!-- lang-string -->
				<h1>Add an Entry</h1> <!-- lang-string -->
				<div class="clearfix"></div>

			</header>

			<form class="main seperate" id="addEntryForm">

				<select class="default-select" id="entrySelection" required>
					
					<option value="" disabled selected>Select the type</option> <!-- lang-string -->
					<option value="Food">Food</option> <!-- lang-string -->
					<option value="Clothes">Clothes</option> <!-- lang-string -->
					<option value="Tech">Tech</option> <!-- lang-string -->
					<option value="Games">Games</option> <!-- lang-string -->
					<option value="Entertainment">Entertainment</option> <!-- lang-string -->
					<option value="Other">Other</option> <!-- lang-string -->

				</select>

				<label>
					
					<input type="text" id="nameOfPurchase" enterkeyhint="next" required>

				</label>

				<label class="dollar-input">

					$ <input type="number" inputmode="decimal" id="addNewValue" enterkeyhint="done" step=".01" required>
				
				</label>
				
				<button type="button" id="addNewEntryButton" class="full green" disabled>Add!</button>

			</form>

		</section>

	</main>

<script src="/js/build.js"></script>

</body>
</html>
