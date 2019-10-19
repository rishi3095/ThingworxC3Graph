
TW.Runtime.Widgets.c3graph = function () {

	var valueElem;
	var thisWidget = this;
	var chart;

	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName). In
		// this example, we'll just return static HTML
		// '<div id="chart"></div>' +
		// console.log(this.jqElementId);
		return '<div class="widget-content widget-c3graph" id="' + this.jqElementId +
			'"></div>';
	};

	this.afterRender = function () {
		console.log('after render');

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
			thisWidget.graphType = updatePropertyInfo.ActualDataRows[0].graphType;
			thisWidget.chartTitle = updatePropertyInfo.ActualDataRows[0].chartTitle;
			thisWidget.subChart = updatePropertyInfo.ActualDataRows[0].showSubChart;
			this.drawChart(thisWidget.data);
		}

	};
	function isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	}
	this.rowLength = (data) => {
		if (data) {
			// console.log(property2Data.rows);
			return data.hasOwnProperty('property2') ? (data[0].property2.rows.length > 0 ? true : false) : false;
		}
		else
			return true;
	}
	this.drawChart = function (data) {
		try {
			console.log(data);
			if (!isEmpty(data[0].Data) || this.rowLength(data)) {

				var regionData = thisWidget.formatOverlay(data[0].Overlay.printerStates, data[0].timezone);
				var generateObj = this.generateChartObj(data, regionData);
				chart = c3.generate(generateObj);
			}
			else {
				console.log(data);
				let generate = {
					bindto: "#" + this.jqElementId,
					data: {
						x: 'date',
						columns: [
						]
					},
					axis: {
						x: {
							type: 'timeseries'
						}
					}
				};
				if (thisWidget.chartTitle) generate.title = { text: thisWidget.chartTitle + '( NO DATA POINTS AVAILABLE )' };
				c3.generate(generate);
			}
		} catch (error) {
			console.log(error);
		}
	}
	thisWidget.formatOverlay = (regionData, offset) => {
		var region = [];
		region = regionData.map((x) => {
			return { start: GetPrinterTimestamp(x.start, offset), end: GetPrinterTimestamp(x.end, offset), class: x.class };
		});
		return region;
	}
	this.getParentWidth = (elem) => {
		return document.getElementById(elem).parentNode.parentElement.clientWidth;
	}
	this.getParentHeight = (elem) => {
		return document.getElementById(elem).parentNode.parentElement.clientHeight;
	}
	this.createData = function (data, prop1, prop2, data2) {
		try {
			// console.log('reached here');
			var date1 = [], date2 = [];
			var values1 = [], values2 = [];
			if (prop1) {
				// console.log(prop1);
				var propData1 = data;
				if (propData1 != null && propData1.length > 0) {

					date1 = propData1.map((row) => {
						return GetTimestamp(row.timestamp);
					});
					values1 = propData1.map((row) => {
						return row.value;
					});
					prop1 && prop2 ? date1.splice(0, 0, 'date1') : date1.splice(0, 0, 'date');
					values1.splice(0, 0, prop1);
					thisWidget.propDate1 = date1;
					thisWidget.propValue1 = values1;
					// console.log(thisWidget.propValue1);
					// console.log(thisWidget.propDate1);
				}
				else {
					thisWidget.propDate1 = undefined;
					thisWidget.propValue1 = undefined;
				}
			};
			if (prop2) {
				// console.log('here2');
				values2.push(prop2)
				if (data2 != null && data2.length > 0) {
					date2 = data2.map((row) => {
						return GetTimestamp(row.timestamp);
					});
					values2 = data2.map((row) => {
						return row.value;
					});
					date2.splice(0, 0, 'date2');
					values2.splice(0, 0, prop2);
					thisWidget.propDate2 = date2;
					thisWidget.propValue2 = values2;

				}
				else if (thisWidget.propValue1 !== undefined) {
					thisWidget.propDate2 = undefined;
					thisWidget.propValue2 = undefined;
				}
			};
		} catch (e) {
			console.log(e);
		}

	}

	function GetPrinterTimestamp(time, offset) {
		let d = new Date(time);
		let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		let nd = new Date(utc + (3600000 * offset));
		return nd.toLocaleString('en-US', { hour12: false });
	}

	function GetTimestamp(time) {
		let d = new Date(time);
		return d.toLocaleString('en-US', { hour12: false });
	}

	this.generateChartObj = (data, regionData) => {
		var generateObj = {
			bindto: "#" + this.jqElementId,
			size: {
				height: this.getParentHeight(document.querySelector('.widget-c3graph').id),
				width: this.getParentWidth(document.querySelector('.widget-c3graph').id)
			},

			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%m/%d/%Y, %H:%M:%S', // how the date is displayed
						count: 10
					}

				}
			},
			zoom: {
				enabled: true
			},
			subchart: {
				show: thisWidget.subChart
			},
			legend: {
				show: false
			},
			regions: regionData,
			title: {
				text: thisWidget.chartTitle
			}
		};
		if (data[0].property1Name || data[0].property2Name) {
			if (data[0].property1Name && data[0].property2Name) {
				let prop1 = data[0].property1Name; let prop2 = data[0].property2Name;
				var xs = {};
				xs[prop1] = 'date1';
				xs[prop2] = 'date2';
				this.createData(data[0].Data.rows, prop1, prop2, data[0].property2.rows);
				generateObj.data = {
					xs: xs,
					xFormat: '%m/%d/%Y, %H:%M:%S', //how the date is parsed
					columns: [
						thisWidget.propDate1,
						thisWidget.propValue1,
						thisWidget.propDate2,
						thisWidget.propValue2
					],
					type: thisWidget.graphType
				};
				if (thisWidget.graphType.toLowerCase() === 'bar')
					generateObj.bar = {
						width: 5
					}

			} else if (data[0].property1Name && !data[0].property2Name) {
				// console.log('here');
				this.createData(data[0].Data.rows, data[0].property1Name);
				generateObj.data = {
					x: 'date',
					xFormat: '%m/%d/%Y, %H:%M:%S', //how the date is parsed
					columns: [
						thisWidget.propDate1,
						thisWidget.propValue1
					],
					type: thisWidget.graphType
				};
				if (thisWidget.graphType.toLowerCase() === 'bar')
					generateObj.bar = {
						width: 5
					}
			}

		}

		if (!this.validateNullOrUndefined(data[0].value_min) && !this.validateNullOrUndefined(data[0].value_max)) {
			if (data[0].value_min === data[0].value_max) {
				var dates = data[0].Data.rows;
				var gridDate = dates.map((row) => {
					return row.timestamp;
				});
				gridDate.splice(0, 0, 'date');
				var gridData = dates.map((row) => {
					return data[0].value_min;
				});
				gridData.splice(0, 0, 'Threshold');
				console.log(gridDate + '   ' + gridData);
				generateObj.data.columns.push(gridDate, gridData);
			}
			else {
				console.log(data[0].value_min + '    ' + data[0].value_max);
				var dates = data[0].Data.rows;
				var gridDate = dates.map((row) => {
					return row.timestamp;
				});
				gridDate.splice(0, 0, 'date');
				var gridData = dates.map((row) => {
					return data[0].value_min;
				});
				gridData.splice(0, 0, 'Value Min: ');
				var gridDate1 = dates.map((row) => {
					return row.timestamp;
				});
				gridDate1.splice(0, 0, 'date');
				var gridData1 = dates.map((row) => {
					return data[0].value_max;
				});
				gridData1.splice(0, 0, 'Value Max: ');
				// console.log(gridDate + '   ' + gridData1);
				generateObj.data.columns.push(gridDate, gridData, gridDate1, gridData1);

			}
		}
		console.log(generateObj);
		return generateObj;
	}

	this.validateNullOrUndefined = (value) => {
		return value === undefined || value === null || value === "" || value === {} || value === [];
	}
};



