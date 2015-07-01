function setup(flashcardData) {

	var currentTimeStep = 0;
	var currentDatum = flashcardData[0];
	var currentFlashcard = currentDatum['flashcards'][0];

	function getNextFlashcard(flashcards) {
		var earliestFlashcard = flashcards[0];
		flashcards.forEach(function(flashcard) {
			var lastTimeSeen = flashcard["lastTimeSeen"];
			var timesCorrectInARow = flashcard["timesCorrectInARow"];
			var whenToShowAgain = lastTimeSeen + Math.pow(2, timesCorrectInARow);
			flashcard["whenToShowAgain"] = whenToShowAgain;
			if (flashcard["whenToShowAgain"] < earliestFlashcard["whenToShowAgain"]) {
				earliestFlashcard = flashcard;
			}
		});
		return earliestFlashcard;
		
	}
	function displayFlashcard(flashcard) {
		var wordElem = $("<div>"+flashcard['word']+"</div>");
		$(".flashcard-box").html(wordElem);
		currentTimeStep = currentTimeStep + 1;
		flashcard['lastTimeSeen'] = currentTimeStep;
	}

	
	var data = {
		labels: ["incorrect", "correct"],
		datasets: [
			{
				data: [40,60]
			}
		]
	};
	var ctx = document.getElementById("myChart").getContext("2d");
	var myNewChart = new Chart(ctx).Bar(data);
	
	$(".flashcard-box").on("click", function() {
		$(".flashcard-box").html(currentFlashcard['definition']);
	});
	$("#correct-button").on("click", function() {
		console.log(currentDatum);
		currentFlashcard['timesCorrectInARow'] = currentFlashcard['timesCorrectInARow'] + 1;
		currentFlashcard = getNextFlashcard(currentDatum['flashcards']);
		displayFlashcard(currentFlashcard);
	});
	$("#incorrect-button").on("click", function() {
		console.log(currentDatum);
		currentFlashcard['timesCorrectInARow'] = 0;
		currentFlashcard = getNextFlashcard(currentDatum['flashcards']);
		displayFlashcard(currentFlashcard);
	});
	
	//create subject links on left
	flashcardData.forEach(function(datum) {
		var prefix = "<div class=\"set-link\">";
		var suffix = "</div>";
		
		var html = prefix + datum['name'] + suffix;
		var elem = $(html);
		elem.on("click", function() {
			$("#title").html(datum['name']);
			currentDatum = datum;
			currentFlashcard = getNextFlashcard(currentDatum['flashcards']);
			displayFlashcard(currentFlashcard);
		});
		$("#subject-list").append(elem);
	});
		


}
$(function() {
	var flashcardData = [
		{
			name: "SAT Vocabulary",
			flashcards: [
				{word: "candid", definition: "honest", timesCorrectInARow: 0, lastTimeSeen: 0},
				{word: "vestigial", definition: "like the human appendix", timesCorrectInARow: 0, lastTimeSeen: 0},
			]
		},
		{
			name: "Chemistry",
			flashcards: [
				{word: "Cu", definition: "Copper", timesCorrectInARow: 0, lastTimeSeen: 0},
				{word: "Ag", definition: "Silver", timesCorrectInARow: 0, lastTimeSeen: 0},
			]
		},
	];
	setup(flashcardData);
});