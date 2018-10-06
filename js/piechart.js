var _ = require('lodash');

function aggregate(rawdata, key) {
	if(_.isArray(rawdata)) {
		return _.chain(rawdata)
		.filter(function(row) { return row.sense == key })
		.sortBy('tag')
		.groupBy('tag')
		.map(function(obj){ return _.sumBy(obj, function(row){ return Math.abs(row.value) }) })
		.value()
	} else {
		return [];
	}
}

function render(rawdata) {

	var labels = _(rawdata)
		.map(function(o) { return { sense: o.sense, label: o.tag }; })
		.uniqWith(_.isEqual)
		.sortBy('label')
		.groupBy('sense')
		.mapValues(function(o) { return _.map(o, 'label'); })
		.value();

	var positiveData = aggregate(rawdata, 'مثبت');
	var negativeData = aggregate(rawdata, 'منفی');


	var options = {
		responsive: true,
		legend: {
			position: 'bottom',
		},
		animation: {
			animateScale: true,
			animateRotate: true
		}
	};

	positivePie({
		type: 'doughnut',
		options: options,
		data: {
			datasets: [{
				data: positiveData,
				backgroundColor: window.chartColors.positive,
				label: 'نظرات مثبت'
			}],
			labels: labels['مثبت'],
		}
	});
	
	negativePie({
		type: 'doughnut',
		options: options,
		data: {
			labels: labels['منفی'],
			datasets: [{
				data: negativeData,
				backgroundColor: window.chartColors.negative,
				label: 'نظرات منفی'
			}]
		}
	});

}

function positivePie(props) {

	var ctx = document.getElementById("doughnutPositive").getContext('2d');

	var myChart = new Chart(ctx, props);
	myChart.update();

	// return chart;

}

function negativePie(props) {

	var ctx = document.getElementById("doughnutNegative").getContext('2d');

	var myChart = new Chart(ctx, props);
	myChart.update();

	// return chart;

}

module.exports = render;
