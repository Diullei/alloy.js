
// Core
exports.AlloyJs.apply = function(el, ctx){
	var self = this;
	ctx = ctx || window;
	var html = el.innerHTML;

	self.parser.extractProperty(html);

	for(var i = 0; i < self.binds.length; i++){
		var bind = self.binds[i];
		html = html.replace(new RegExp('\{\{' + bind.property + '\}\}'), '<span id="_' + bind.html_id + '"></span>');
	}

	el.innerHTML = html;

	for(var i = 0; i < self.binds.length; i++){
		var bind = self.binds[i];

		eval('self.ob.bind("' + bind.property + '", '
			+ 'function(value){ return value; }, '
			+ 'function( value ){ var el = self.hq.get("_' + bind.html_id + '"); el.textContent = value; el.innerText = value; } );');

		var el = self.hq.get('_' + bind.html_id);
		eval('el.textContent = ' + bind.property);	
		eval('el.innerText = ' + bind.property);
	}
}
