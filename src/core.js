
// Core

exports.AlloyJs.applyStr = function(str, ctx) {
	var self = this;
	ctx = ctx || window;

	if(!this.utils.isString(str))
		return str;

	var parsedStrResult = this.parser.parseString(str);

	if(parsedStrResult.tokens) {
		if(parsedStrResult.tokens.length > 0) {
			var parsedStr = parsedStrResult.str;

			for(var i = 0; i < parsedStrResult.tokens.length; i++) {
				var token = parsedStrResult.tokens[i];
				eval('var val = self.utils.evaluate( "' + token.token + '", ctx) ');
				parsedStr = parsedStr.replace(token.id, val);
			}

			return parsedStr;
		}
	}

	return str;
}

var pubSub = {
	cache: {},
	on: function(context, id, callback) {
		if(!this.cache[context])
			this.cache[context] = {};
		this.cache[context][id] = callback;
	},
	trigger: function(context, id, value) {
		if(this.cache[context]){
			var callback = this.cache[context][id];
			if(callback) {
				callback(id, value);
			}
		}
	}
}

exports.AlloyJs.apply = function(el, ctx) {
	var self = this;
	ctx = ctx || window;
	var html = el.innerHTML;

	html = self.parser.extractProperty(html);
	el.innerHTML = html;

	for(var i = 0; i < self.binds.length; i++) {
		var bind = self.binds[i];

		if(bind.type == 'content') {
			html = html.replace(new RegExp('\{\{' + bind.property + '\}\}'), '<span id="_' + bind.html_id + '"></span>');
			eval('pubSub.on(ctx, bind.html_id, function(id, value){ '
				+ 'var el = self.hq.get("_" + id); '
				+ 'el.textContent = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) ); '
				+ 'el.innerText = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) ); '
			+ ' });');
		}
	}

	el.innerHTML = html;

	for(var i = 0; i < self.binds.length; i++) {
		var bind = self.binds[i];

		if(bind.type == 'content') {
			var el = self.hq.get('_' + bind.html_id);

			eval('el.textContent = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) )');
			eval('el.innerText = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) )');

			eval('self.ob.bind("' + bind.property + '", '
				+ 'function(value){ return value; }, '
				+ 'function( value ){ pubSub.trigger(ctx, "' + bind.html_id + '", value); }, ctx );');

		} else if(bind.type == 'al-bind') {
			var el = self.hq.get('_' + bind.html_id);
			eval('el.addEventListener("change", function(){ with(ctx) {  ' + bind.property + ' = this.value; } });');
		}
	}
}

