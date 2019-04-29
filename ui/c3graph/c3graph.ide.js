TW.IDE.Widgets.c3graph = function () {

	this.widgetIconUrl = function() {
		return  "'../Common/extensions/c3Graphs/ui/c3graph/c3.png'";
	};

	this.widgetProperties = function () {
		return {
			'name': 'C3Graph',
			'description': '',
			'category': ['Common'],
			'supportsAutoResize':true,
			'properties': {
				'Data': {
                    'description': 'Data source',
                    'isBindingTarget': true,
                    'isEditable': false,
                    'baseType': 'INFOTABLE',
                    'isVisible': true,
                    'warnIfNotBoundAsTarget': false
				},
				'NumberOfSeries': {
					'description': 'Desired number of series in this chart',
                    'defaultValue': 1,
                    'baseType': 'NUMBER',
                    'isVisible': true
				}
			}
		}
	};

	this.afterSetProperty = function (name, value) {
		var thisWidget = this;
		var refreshHtml = false;
		switch (name) {
			case 'Style':
			case 'C3Graph Property':
				thisWidget.jqElement.find('.c3graph-property').text(value);
			case 'Alignment':
				refreshHtml = true;
				break;
			default:
				break;
		}
		return refreshHtml;
	};

	this.renderHtml = function () {
		// return any HTML you want rendered for your widget
		// If you want it to change depending on properties that the user
		// has set, you can use this.getProperty(propertyName).
		return 	'<div class="widget-content widget-c3graph">' +
					'<span class="c3graph-property">' + this.getProperty('C3Graph Property') + '</span>' +
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

};