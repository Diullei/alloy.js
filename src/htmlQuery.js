
// HtmlQuery
exports.AlloyJs.hq = (function(AlloyJs, $wnd, $doc){

	function HtmlQuery(){}

	HtmlQuery.prototype.get = function(id) {
		return document.getElementById(id);
	};

	HtmlQuery.prototype.getByAttribute = function(attribute) {
		var matchingElements = [];
		var allElements = document.getElementsByTagName('*');
		for (var i = 0; i < allElements.length; i++) {
			if (allElements[i].getAttribute(attribute) != null) {
				matchingElements.push(allElements[i]);
			}
		}
		return matchingElements;
  	};

	return new HtmlQuery();

})(exports.AlloyJs, $wnd, $doc);
