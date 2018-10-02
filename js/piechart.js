var _ = require('lodash');
// var pdate = require('persian-date');
// var queryResult = require('./data.json');

(function ($) {
	"use strict"; // Start of use strict

	var queryUrl = 'https://app.jadoobi.com/sobhe/api/queries/12148/results.json?api_key=GLWHkzs5Tj18m79Hn1JpHRbaCI8vDOkUMsfqq8aX';
	var rows = null;

	// $.get(queryUrl, function(queryResult){
	// 	rows = queryResult.query_result.data.rows;
	// });

	rows = _.partition(rows, 'احساس');
	console.log(rows);
	return;

	rows = _.map(rows, function(row) {
		return {
			date: new Date(row['تاریخ']),
			date_label: new pdate(new Date(row['تاریخ'])).format(pdateFormat),
			tag: row['عنوان'],
			value: row['تعداد کل']
		}
	});

	var labels = _.uniq(_.map(_.sortBy(rows, 'date'), function(row){
		return new pdate(row.date).format(pdateFormat)
	}));

	window.chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

	window.chartColors = _.map(window.chartColors, function(o){ return o });

	var datasets = _.map(_.uniq(_.map(rows, function(o){ return o.tag })), function(label, index){
		return {
			label: label,
			data: [],
			backgroundColor: window.chartColors[index]
		}
	});

	_.each(rows, function(row){
		var index = _.findIndex(datasets, function(o){ return o.label == row.tag});
		_.each(labels, function(label, labelIndex){
			var value = (row.date_label == label) ? row.value : 0;
			if(datasets[index].data[labelIndex]) {
				datasets[index].data[labelIndex] += value;
			} else {
				datasets[index].data[labelIndex] = value;
			}
		});
	});

	var ctxPositive = document.getElementById("piechartPositive").getContext('2d');
	var ctxNegative = document.getElementById("piechartNegative").getContext('2d');

	var options = {
		responsive: true,
		scales: {
			xAxes: [{
				stacked: true
			}],
			yAxes: [{
				stacked: true,
				// ticks: {
				// 	beginAtZero: true
				// }
			}]
		}
	};
	var data = {
		labels: labels,
		datasets: datasets
	};

	var mainChart = new Chart(ctx, {
		type: 'bar',
		data: data,
		options: options
	});

})(jQuery);