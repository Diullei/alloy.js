
// Parser
exports.AlloyJs.parser = (function(AlloyJs, $wnd, $doc){

	function Parser(){}

	Parser.prototype.exec = function(text, obj) {
		var result = {text:''};
		HTMLParser(text, {
			start: function( tag, attrs, unary ) {
				obj.start(result, tag, attrs, unary );
			},
			end: function( tag ) {
				obj.end( result, tag );
			},
			chars: function( text ) {
				obj.chars( result, text );
			},
			comment: function( text ) {
				obj.comment( result, text );
			}
		});
		return result;
	};

	Parser.prototype.extractProperty = function(tmpl) {
		AlloyJs.binds = [];
		var pattern = /\{\{.+?\}\}/gi
		var code = tmpl.match(pattern);	
		if(code) {
			for(var i = 0; i < code.length; i++) {
				AlloyJs.binds.push({
					property: code[i].substr(2, code[i].length - 4),
					html_id: AlloyJs.utils.guid()
				});
			}
		}
	}

	Parser.prototype.parseString = function(str) {
		var tokens = [];
		var pattern = /\$\{.+?\}/gi
		var code = str.match(pattern);	
		
		if(code) {
			for(var i = 0; i < code.length; i++) {
				var id = AlloyJs.utils.guid();
				tokens.push({
					token: code[i].substr(2, code[i].length - 3),
					id: id
				});
				str = str.replace(code[i], id);
			}
		}

		return {str: str, tokens: tokens };
	}

	return new Parser();

})(exports.AlloyJs, $wnd, $doc);
