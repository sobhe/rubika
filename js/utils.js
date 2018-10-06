var _ = require('lodash');
var pdate = require('persian-date');

(function ($) {
	
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
	
	window.pdateFormat = 'YYYY/MM/DD';
	
})(jQuery);

function prepareRows(rows) {

	return _.map(rows, function(row) {
		return {
			date: new Date(row['تاریخ']),
			date_label: new pdate(new Date(row['تاریخ'])).format(window.pdateFormat),
			tag: row['عنوان'],
			value: row['تعداد کل'],
			sense: row['احساس']
		}
	});

}

module.exports = {
	prepareRows,
}