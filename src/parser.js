
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

	function parseContent(data, text) {
		var pattern = /\{\{.+?\}\}/gi
		var code = text.match(pattern);	
		if(code) {
			for(var i = 0; i < code.length; i++) {
				data.binds.push({
					type: 'content',
					property: code[i].substr(2, code[i].length - 4),
					html_id: AlloyJs.utils.guid()
				});
			}
		}
	}

	function parseAttributes(id, data, attrib, content) {
		if(attrib == 'data-al-bind') {
			data.binds.push({
				type: 'al-bind',
				property: content.trim(),
				html_id: id
			});
			return true;
		}
		return false;
	}

	Parser.prototype.extractProperty = function(tmpl) {
		AlloyJs.binds = [];

		var data = { binds: []};

		var parsedHtml = $al.parser.exec(
			tmpl, {
			start: function(out, tag, attrs, unary ) {
				var id = AlloyJs.utils.guid();
				var handled = false;

			    out.text += "<" + tag;

			    for ( var i = 0; i < attrs.length; i++ ) {
			    	var flg = parseAttributes(id, data, attrs[i].name, attrs[i].escaped);
			    	if(flg) {
			    		handled = flg;
			    	}
				    out.text += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
				}

				if(handled) {
					out.text += ' id="_' + id + '"';
				}

			    out.text += (unary ? "/" : "") + ">";
			},
			end: function(out, tag ) {
			    out.text += "</" + tag + ">";
			},
			chars: function(out, text ) {
				parseContent(data, text);
			    out.text += text;
			},
			comment: function(out, text ) {
			    out.text += "<!--" + text + "-->";
			}
		});

		AlloyJs.binds = data.binds;

		return parsedHtml.text;
	}

	Parser.prototype.parseString = function(str) {

		if(!$al.utils.isString(str))
			return str;

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
