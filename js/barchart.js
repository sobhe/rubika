var _ = require('lodash');
var pdate = require('persian-date');

module.exports = function (rawdata) {

	var labels = _.uniq(_.map(_.sortBy(rawdata, 'date'), function(row){
		return new pdate(row.date).format(pdateFormat)
	}));

	var datasets = _.uniqWith(_.map(rawdata, function(o){ return {label: o.tag, sense: o.sense} }), _.isEqual);
	datasets = _.map(datasets, function(o){ return _.assign(o, {data: []})});

	var positiveIndex = 0;
	var negativeIndex = 0;
	_.each(datasets, function(set, index){
		datasets[index].backgroundColor = (set.sense == 'منفی') ? window.chartColors.negative[negativeIndex++] : window.chartColors.positive[positiveIndex++];
	});

	_.each(rawdata, function(row){
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
		responsive: true,
		tooltips: {
			mode: 'index'
		},
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
