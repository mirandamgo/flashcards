//TODO get actual flashcards
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

function getNextFlashcard(flashcards) {
	return flashcards[0];
	//TODO implement function properly
}


$(function() {
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
		$(".flashcard-box").html("hello");
	});
	
	//create subject links on left
	flashcardData.forEach(function(datum) {
		var prefix = "<div class=\"set-link\">";
		var suffix = "</div>";
		
		var html = prefix + datum['name'] + suffix;
		var elem = $(html);
		elem.on("click", function() {
			$("#title").html(datum['name']);
		});
		$("#subject-list").append(elem);
	});
	
});
