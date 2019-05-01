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

	this.drawChart = function(data){
		//var id = thisWidget.mashup.rootName + "_" + thisWidget.getProperty('Id');
		//var container = document.getElementById(id);
		try {
			this.createData(data);
			var chart = c3.generate({
				data: {
					x: 'date',
					columns: [
						['date', '2014-01-01', '2014-01-10', '2014-01-20', '2014-01-30', '2014-02-01'],
						['sample', 30, 200, 100, 400, 150, 250]
					]
				},
				axis: {
					x: {
						type: 'timeseries'
					}
				},
				regions: [
					{start: '2014-01-05', end: '2014-01-10'},
					{start: new Date('2014/01/15'), end: new Date('20 Jan 2014')},
					{start: 1390575600000, end: 1391007600000} // start => 2014-01-25 00:00:00, end => 2014-01-30 00:00:00
				]
			});	
		} catch (error) {
			console.log(error);
		}
	}
};


this.createData = function(data){
	if(data!= null && data.length > 0){
		for(let i=0; i<data.length;i++){
			var row = data[i];
			
		}
		
	}
}