

function init() {
	setTimeout( function() {
		var inits = $al.hq.getByAttribute('data-al-init');
		for(var i = 0; i < inits.length; i++) {
			$al.apply(inits[i]);
		}
	}, 50);
}
window.addEventListener("load", init, false);

})(window, window.document);