TW.Runtime.Widgets.c3graph= function () {
	var valueElem;
	var thisWidget = this;
	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName). In
		// this example, we'll just return static HTML
		
		return 	'<div class="widget-content widget-c3graph">' +
				'<div id="chart"></div>'+
				'</div>';
	};

	this.afterRender = function () {
		// NOTE: this.jqElement is the jquery reference to your html dom element
		// 		 that was returned in renderHtml()
		this.drawChart();
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
			
		}
	};

	this.drawChart = function(){
		//var id = thisWidget.mashup.rootName + "_" + thisWidget.getProperty('Id');
		//var container = document.getElementById(id);
		try {
			var chart = c3.generate({
				data: {
					columns: [
						['data1', 30, 200, 100, 400, 150, 250],
						['data2', 50, 20, 10, 40, 15, 25]
					]
				}
			});			
		} catch (error) {
			console.log(error);
		}
	}
};
