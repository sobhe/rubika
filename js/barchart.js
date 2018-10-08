var _ = require('lodash');
var pdate = require('persian-date');

function calculateMinMax(datasets) {

	_.mixin({
		zipUp: function(arrays){
			return _.zip.apply(_, arrays);
		}
	});

	var values = _(datasets)
		.map(function(set){ return set.data })
		.zipUp()
		.map(function(row){
			return {
				min: _.reduce(row, function(sum, n){ return (_.lt(n, 0)) ? sum + n : sum }, 0),
				max: _.reduce(row, function(sum, n){ return (_.gt(n, 0)) ? sum + n : sum }, 0),
			}
		})
		.value();

	return {
		min: _.floor(_.get(_.minBy(values, 'min'), 'min'), -2),
		max: _.ceil(_.get(_.maxBy(values, 'max'), 'max'), -2),
	}
}

module.exports = function (rawdata) {

	var labels = _(rawdata)
		.sortBy('date')
		.map(function(row){ return new pdate(row.date).format(pdateFormat) })
		.uniq()
		.value();

	var datasets = _(rawdata)
		.groupBy('sense')
		.mapValues(function(senseGroup, senseName){
			return _(senseGroup)
				.groupBy('tag')
				// .sortBy()
				.mapValues(function(tagGroup, tagName){ 
					return {
						data: _.map(labels, function(label){
							var foundRow = _.find(tagGroup, function(row){ return row.date_label == label });
							return (foundRow) ? foundRow.value : 0;
						}),
						label: tagName
					}
				})
				.sortBy('label')
				.values()
				.map(function(set, index){
					return _.assign(set, { backgroundColor: window.chartColors[(senseName == 'مثبت') ? 'positive' : 'negative'][index] })
				})
				.value();
		})
		.values()
		.flatten()
		.value();

	var ctx = document.getElementById("mainChart").getContext('2d');

	var annotationPoints = {
		'شروع جام جهانی': '۱۳۹۷/۰۳/۲۴',
		'پایان جام جهانی': '۱۳۹۷/۰۴/۲۴',
	}
	var annotations = _.map(annotationPoints, function(value, content) {
		return {
			type: 'line',
			// id: 'a-line-1',
			mode: 'vertical',
			scaleID: 'x-axis-0',
			value: value,
			borderColor: 'rgba(244, 66, 66, 0.5)',
			borderWidth: 2,
			borderDash: [10,10],
			borderDashOffset: 1,
			label: {
				enabled: true,
				backgroundColor: 'rgba(0,0,0,0.5)',
				fontFamily: "Shabnam",
				fontSize: 10,
				fontStyle: "normal",
				fontColor: "#fff",
				xPadding: 6,
				yPadding: 6,
				cornerRadius: 6,
				position: "bottom",
				xAdjust: 0,
				yAdjust: 0,
				content: content
			}
		}
	});

	var options = {
		responsive: true,
		tooltips: {
			mode: 'index'
		},
		legend: {
			position: 'bottom'
		},
		scales: {
			xAxes: [{
				stacked: true
			}],
			yAxes: [{
				stacked: true,
				ticks: calculateMinMax(datasets)
			}]
		},
		annotation: {
			drawTime: 'beforeDatasetsDraw',
			annotations: annotations
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

	window.mainChart = mainChart;
}
