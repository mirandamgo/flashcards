var maxNewCardsAtOnce = 10;
function storageLoad(){
	return JSON.parse(window.localStorage.getItem("data"));
};
function storageSave(flashcardData){
	window.localStorage.setItem("data", JSON.stringify(flashcardData));
};
function setup(flashcardData) {

	var currentTimeStep = 0;
	var currentDatum = flashcardData[0];
	var currentFlashcard = currentDatum['flashcards'][0];
	
	function recalculateScores(flashcards){
		var currentScore = 0;
		var numCardsCorrect = 0;
		var numCardsSeen = 0;
		flashcards.forEach(function(flashcard){
			var isCorrect = flashcard["timesCorrectInARow"] > 0;
			if (isCorrect){
				numCardsCorrect = numCardsCorrect + 1;
			}
			var isSeen = flashcard["lastTimeSeen"] > 0;
			if (isSeen){
				numCardsSeen = numCardsSeen + 1;
			}
			if (flashcard["timesCorrectInARow"] >= 2){
				currentScore = currentScore + 10;
			} else if (flashcard["timesCorrectInARow"] === 1){
				currentScore = currentScore + 5;
			} else if (isSeen){
				currentScore = currentScore + 1;
			}
		})
		var percentCorrect = numCardsSeen === 0 ? 0 : numCardsCorrect/numCardsSeen*100;
		
		$("#percent-correct-value").html(Math.round(percentCorrect) + "%");
		$("#current-score-value").html(currentScore);
	}
	
	function recalculateChart(flashcards){
		var counts = [];
		flashcards.forEach(function(flashcard){
			var x = flashcard["timesCorrectInARow"];
			if (!counts[x]){
				counts[x] = 0
			}
			counts[x] = counts[x] + 1;
		});
		for (var i = 0; i < counts.length; i++) {
			counts[i] = counts[i] || 0;
		}
		var data = {
			labels: Object.keys(counts),
			datasets: [
				{
					data: counts
				}
			]
		};
		var ctx = document.getElementById("myChart").getContext("2d");
		var myNewChart = new Chart(ctx).Bar(data);
	}
	function getNextFlashcard(flashcards) {
		var earliestFlashcard = flashcards[0];
		var numIncorrectCards = 0;
		flashcards.forEach(function(flashcard) {
			var lastTimeSeen = flashcard["lastTimeSeen"];
			var timesCorrectInARow = flashcard["timesCorrectInARow"];
			if (timesCorrectInARow === 0){
				numIncorrectCards = numIncorrectCards + 1;
			}
			if (numIncorrectCards <= maxNewCardsAtOnce){
				var whenToShowAgain = lastTimeSeen + Math.pow(2, timesCorrectInARow);
				flashcard["whenToShowAgain"] = whenToShowAgain;
				if (flashcard["whenToShowAgain"] < earliestFlashcard["whenToShowAgain"]) {
					earliestFlashcard = flashcard;
				}
			}
			
		});
		recalculateChart(flashcards);
		recalculateScores(flashcards);
		storageSave(flashcardData);
		return earliestFlashcard;
		
	}
	function displayFlashcard(flashcard) {
		var wordElem = $("<div>"+flashcard['word']+"</div>");
		$(".flashcard-box").html(wordElem);
		currentTimeStep = currentTimeStep + 1;
		flashcard['lastTimeSeen'] = currentTimeStep;
	}

	
	
	
	$(".flashcard-box").on("click", function() {
		var html = "<div>"
		+ currentFlashcard['word'] 
		+ "<br><br><b>"
		+ currentFlashcard['definition']
		+ "</b></div>";
		$(".flashcard-box").html(html);
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
	$("#reset").on("click", function() {
		if (confirm("are you sure?")){
			window.localStorage.removeItem("data");
			window.location.reload();
		}
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
	var flashcardData = storageLoad();
	if (flashcardData){
		setup(flashcardData);
		return;
	}
	flashcardData = [
	
	];
	var files = ["satvocab.csv", "periodictable.csv"];
	
	
	function processDownloadedFile(subjectName, response){
		var flashcards = [];
		flashcardData.push({name: subjectName, flashcards: flashcards});
		var lines = response.split("\n");
		
		lines.forEach(function(line){
			var fields = line.substring(1, line.length-1).split('","');
			if (fields[0] && fields[1]) {
				var flashcard = {word: fields[0], definition: fields[1], timesCorrectInARow: 0, lastTimeSeen: 0};
				flashcards.push(flashcard);
			}
		});
		if (flashcardData.length === files.length){
			setup(flashcardData);
		}
	}
	files.forEach(function(filename){
		var promise = $.get(filename);	
		promise.then(function(response){
			processDownloadedFile(filename, response);
		});
	});
});