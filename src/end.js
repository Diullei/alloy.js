

function init() {
	setTimeout( function() {
		var inits = $al.hq.getByAttribute('data-al-init');
		for(var i = 0; i < inits.length; i++) {
			var context = null;
			var attrValue = inits[i].getAttribute('data-al-init');
			if(attrValue) {
				context = $al.oq.get(attrValue);
			}
			$al.apply(inits[i], context);
		}
	}, 50);
}
window.addEventListener("load", init, false);

})(window, window, window.document);