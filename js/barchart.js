var _ = require('lodash');
var pdate = require('persian-date');
// var queryResult = require('./data.json');

(function ($) {
	"use strict"; // Start of use strict

	var queryUrl = 'https://app.jadoobi.com/sobhe/api/queries/12148/results.json?api_key=GLWHkzs5Tj18m79Hn1JpHRbaCI8vDOkUMsfqq8aX';
	var rows = null;

	$.get(queryUrl, function(queryResult){
		rows = queryResult.query_result.data.rows;
		render();
	});

	function render() {
		// var pdateFormat = 'MMMM YY';
		var pdateFormat = 'YYYY/MM/DD';
	
		rows = _.map(rows, function(row) {
			return {
				date: new Date(row['تاریخ']),
				date_label: new pdate(new Date(row['تاریخ'])).format(pdateFormat),
				tag: row['عنوان'],
				value: row['تعداد کل'],
				sense: row['احساس']
			}
		});
	
		var labels = _.uniq(_.map(_.sortBy(rows, 'date'), function(row){
			return new pdate(row.date).format(pdateFormat)
		}));
	
		// window.chartColors = {
		// 	positive: {
		// 		green: 'rgb(75, 192, 192)',
		// 		blue: 'rgb(54, 162, 235)',
		// 		grey: 'rgb(201, 203, 207)',
		// 	},
		// 	negative: {
		// 		red: 'rgb(255, 99, 132)',
		// 		orange: 'rgb(255, 159, 64)',
		// 		yellow: 'rgb(255, 205, 86)',
		// 		purple: 'rgb(153, 102, 255)',
		// 	}
		// };
	
		window.chartColors = {
			positive: [
				'rgb(75, 192, 192)', //green
				'rgb(54, 162, 235)', //blue
				'rgb(201, 203, 207)', //grey
				'#4C8264',
				'#52EAED',
				'#9AB9BB'
			],
			negative: [
				'rgb(255, 99, 132)', //red
				'rgb(153, 102, 255)', //purple
				'rgb(255, 159, 64)', //orange
				'rgb(255, 205, 86)', //yellow
				'#ED7755',
			]
		};
	
		var datasets = _.uniqWith(_.map(rows, function(o){ return {label: o.tag, sense: o.sense} }), _.isEqual);
		datasets = _.map(datasets, function(o){ return _.assign(o, {data: []})});
	
		var positiveIndex = 0;
		var negativeIndex = 0;
		_.each(datasets, function(set, index){
			datasets[index].backgroundColor = (set.sense == 'منفی') ? window.chartColors.negative[negativeIndex++] : window.chartColors.positive[positiveIndex++];
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
	
		var ctx = document.getElementById("mainChart").getContext('2d');
		var options = {
			defaultFontFamily: "'Shabnam'",
			responsive: true,
			scales: {
				xAxes: [{
					stacked: true
				}],
				yAxes: [{
					stacked: true,
					ticks: {
						fontFamily: 'Shabnam'
					// 	beginAtZero: true
					}
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
	}

})(jQuery);