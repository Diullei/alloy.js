
// Core

exports.AlloyJs.applyStr = function(str, ctx){
	ctx = ctx || window;
	var parsedStrResult = this.parser.parseString(str);

	if(parsedStrResult.tokens.length > 0) {
		var parsedStr = parsedStrResult.str;

		for(var i = 0; i < parsedStrResult.tokens.length; i++) {
			var token = parsedStrResult.tokens[i];
			eval('var val = ctx.' + token.token);
			parsedStr = parsedStr.replace(token.id, val);
		}

		return parsedStr;
	}

	return str;
}

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

		var el = self.hq.get('_' + bind.html_id);

		eval('el.textContent = self.applyStr(ctx.' + bind.property + ')');
		eval('el.innerText = self.applyStr(ctx.' + bind.property + ')');

		eval('self.ob.bind("' + bind.property + '", '
			+ 'function(value){ return value; }, '
			+ 'function( value ){ var el = self.hq.get("_' + bind.html_id + '"); el.textContent = self.applyStr(value); el.innerText = self.applyStr(value); }, ctx );');
	}
}
