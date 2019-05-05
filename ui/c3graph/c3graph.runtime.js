TW.Runtime.Widgets.c3graph = function () {
	var valueElem;
	var thisWidget = this;
	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName). In
		// this example, we'll just return static HTML

		return '<div class="widget-content widget-c3graph">' +
			'<div id="chart"></div>' +
			'</div>';
	};

	this.afterRender = function () {
		// NOTE: this.jqElement is the jquery reference to your html dom element
		// 		 that was returned in renderHtml()

		// get a reference to the value element
		valueElem = this.jqElement.find('.c3graph-property');
		// update that DOM element based on the property value that the user set
		// in the mashup builder
		valueElem.text(this.getProperty('C3Graph Property'));
	};

	// this is called on your widget anytime bound data changes
	this.updateProperty = function (updatePropertyInfo) {
		// TargetProperty tells you which of your bound properties changed
		if (updatePropertyInfo.TargetProperty === 'Data') {
			valueElem.text(updatePropertyInfo.SinglePropertyValue);
			thisWidget.data = updatePropertyInfo.ActualDataRows;
			//this.setProperty('Data', updatePropertyInfo.SinglePropertyValue);
			this.drawChart(thisWidget.data);
		}
	};

	this.drawChart = function (data) {

		//var id = thisWidget.mashup.rootName + "_" + thisWidget.getProperty('Id');
		//var container = document.getElementById(id);
		try {
			this.createData(data);
			this.createRegions(data);
			// var chart = c3.generate({
			// 	data: {
			// 		x: 'date',
			// 		columns: [
			// 			['date', '2014-01-01', '2014-01-10', '2014-01-20', '2014-01-30', '2014-02-01'],
			// 			['sample', 30, 200, 100, 400, 150, 250]
			// 		]
			// 	},
			// 	axis: {
			// 		x: {
			// 			type: 'timeseries'
			// 		}
			// 	},
			// 	regions: [
			// 		{start: '2014-01-05', end: '2014-01-10'},
			// 		{start: new Date('2014/01/15'), end: new Date('20 Jan 2014')},
			// 		{start: 1390575600000, end: 1391007600000} // start => 2014-01-25 00:00:00, end => 2014-01-30 00:00:00
			// 	]
			// });
			// console.log('property dates: ' + thisWidget.propDate);
			// console.log('property value:   ' + thisWidget.propValue);
			// console.log('state dates:   ' + thisWidget.stateDate);
			var chart = c3.generate({
				data: {
					x: 'date',
					xFormat: '%Y-%m-%d %H:%M:%S', //how the date is parsed
					columns: [
						thisWidget.propDate,
						thisWidget.propValue
					]
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y-%m-%d %H:%M:%S', // how the date is displayed
							count: 10
						}

					}
				},
				zoom: {
					enabled: true
				},
				subchart: {
					show: true
				},
				regions: thisWidget.stateDate
			});

		} catch (error) {
			console.log(error);
		}
	}

	this.createData = function (data) {
		var date = [];
		var values = [];

		if (data != null && data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				var row = data[i];
				date.push('date');
				values.push(row.propertyName);
				//	console.log(row.propertyName+ ' '+row.PropertyHistory.rows.length);
				for (let j = 0; j < row.PropertyHistory.rows.length; j++) {
					var row1 = row.PropertyHistory.rows[j];
					let result = GetTimestamp(row1.timestamp);
					date.push(result);
					values.push(row1.value);
				}
				thisWidget.propDate = date;
				thisWidget.propValue = values;
			}

		}
	}
	function GetTimestamp(time){
		let timestamp = new Date(time);
		let Y = timestamp.getFullYear();
		let M = timestamp.getMonth() + 1;
		let D = timestamp.getDate();
		let H = timestamp.getHours();
		let m = timestamp.getMinutes();
		let s = timestamp.getSeconds();
		return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
	}
	this.createRegions = (data) => {
		var regionDate = [];
		if (data != null && data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				var row = data[i];
				if (row.StateHistory.rows.length <= 1) {
					let oneRecord = { start: row.StateHistory.timestamp, end: new Date() };
					regionDate.push(oneRecord);
				}
				else {
					console.log(row.StateHistory);
					for (let k = 0; k < row.StateHistory.rows.length; k++) {
						let recordRow = row.StateHistory.rows[k];
						// console.log('diff '+ (row.StateHistory.rows.length - k));
						let nextRowRecord = row.StateHistory.rows.length - k == 1 ?
							{ id: k, value: row.StateHistory.rows[k].value, timestamp: new Date() } : row.StateHistory.rows[k + 1];
						// console.log(row.StateHistory.rows[k]);
						// console.log('current row:'+recordRow.timestamp);
						// console.log('next row'+JSON.stringify(nextRowRecord));
						let records = { start: GetTimestamp(recordRow.timestamp), end: GetTimestamp(nextRowRecord.timestamp),class:recordRow.className };
						regionDate.push(records);
					}
					console.log(regionDate);
					thisWidget.stateDate = regionDate;
					// console.log(thisWidget.stateDate);
				}
			}
		}
	}
};


