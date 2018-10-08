var utils = require('./utils');
var renderBarchart = require('./barchart');
var renderPiechart = require('./piechart');
// var Chart = require('chartjs');

(function ($) {
	"use strict"; // Start of use strict

	var queryUrl = 'https://app.jadoobi.com/sobhe/api/queries/12148/results.json?api_key=GLWHkzs5Tj18m79Hn1JpHRbaCI8vDOkUMsfqq8aX';
	var data = null;

	Chart.defaults.global.defaultFontFamily = "Shabnam";

	$.get(queryUrl, function(queryResult){
		data = utils.prepareRows(queryResult.query_result.data.rows);
		renderBarchart(data);
		renderPiechart(data);
	});
	
})(jQuery);

require('./app');
