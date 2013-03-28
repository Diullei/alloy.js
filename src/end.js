
function init() {
	var inits = $al.hq.getByAttribute('data-al-init');
	for(var i = 0; i < inits.length; i++) {
		$al.apply(inits[i]);
	}
}
window.addEventListener("load", init, false);

})(window, window.document);