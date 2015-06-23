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