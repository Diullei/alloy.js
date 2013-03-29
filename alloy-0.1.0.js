/* *****************************************************************************
	Alloy.JS 0.1.0
	A javascript library to dynamic binding.

	Copyright 2013 Diullei Gomes and other contributors
***************************************************************************** */

(function(){
	/*
	 * HTML Parser By John Resig (ejohn.org)
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 */

	// Regular Expressions for parsing tags and attributes
	var startTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
		endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
		attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
		
	// Empty Elements - HTML 4.01
	var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

	// Block Elements - HTML 4.01
	var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

	// Inline Elements - HTML 4.01
	var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

	// Attributes that have their values filled in disabled="disabled"
	var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

	// Special Elements (can contain anything)
	var special = makeMap("script,style");

	var HTMLParser = this.HTMLParser = function( html, handler ) {
		var index, chars, match, stack = [], last = html;
		stack.last = function(){
			return this[ this.length - 1 ];
		};

		while ( html ) {
			chars = true;

			// Make sure we're not in a script or style element
			if ( !stack.last() || !special[ stack.last() ] ) {

				// Comment
				if ( html.indexOf("<!--") == 0 ) {
					index = html.indexOf("-->");
	
					if ( index >= 0 ) {
						if ( handler.comment )
							handler.comment( html.substring( 4, index ) );
						html = html.substring( index + 3 );
						chars = false;
					}
	
				// end tag
				} else if ( html.indexOf("</") == 0 ) {
					match = html.match( endTag );
	
					if ( match ) {
						html = html.substring( match[0].length );
						match[0].replace( endTag, parseEndTag );
						chars = false;
					}
	
				// start tag
				} else if ( html.indexOf("<") == 0 ) {
					match = html.match( startTag );
	
					if ( match ) {
						html = html.substring( match[0].length );
						match[0].replace( startTag, parseStartTag );
						chars = false;
					}
				}

				if ( chars ) {
					index = html.indexOf("<");
					
					var text = index < 0 ? html : html.substring( 0, index );
					html = index < 0 ? "" : html.substring( index );
					
					if ( handler.chars )
						handler.chars( text );
				}

			} else {
				html = html.replace(new RegExp("(.*)<\/" + stack.last() + "[^>]*>"), function(all, text){
					text = text.replace(/<!--(.*?)-->/g, "$1")
						.replace(/<!\[CDATA\[(.*?)]]>/g, "$1");

					if ( handler.chars )
						handler.chars( text );

					return "";
				});

				parseEndTag( "", stack.last() );
			}

			if ( html == last )
				throw "Parse Error: " + html;
			last = html;
		}
		
		// Clean up any remaining tags
		parseEndTag();

		function parseStartTag( tag, tagName, rest, unary ) {
			tagName = tagName.toLowerCase();

			if ( block[ tagName ] ) {
				while ( stack.last() && inline[ stack.last() ] ) {
					parseEndTag( "", stack.last() );
				}
			}

			if ( closeSelf[ tagName ] && stack.last() == tagName ) {
				parseEndTag( "", tagName );
			}

			unary = empty[ tagName ] || !!unary;

			if ( !unary )
				stack.push( tagName );
			
			if ( handler.start ) {
				var attrs = [];
	
				rest.replace(attr, function(match, name) {
					var value = arguments[2] ? arguments[2] :
						arguments[3] ? arguments[3] :
						arguments[4] ? arguments[4] :
						fillAttrs[name] ? name : "";
					
					attrs.push({
						name: name,
						value: value,
						escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
					});
				});
	
				if ( handler.start )
					handler.start( tagName, attrs, unary );
			}
		}

		function parseEndTag( tag, tagName ) {
			// If no tag name is provided, clean shop
			if ( !tagName )
				var pos = 0;
				
			// Find the closest opened tag of the same type
			else
				for ( var pos = stack.length - 1; pos >= 0; pos-- )
					if ( stack[ pos ] == tagName )
						break;
			
			if ( pos >= 0 ) {
				// Close all the open elements, up the stack
				for ( var i = stack.length - 1; i >= pos; i-- )
					if ( handler.end )
						handler.end( stack[ i ] );
				
				// Remove the open elements from the stack
				stack.length = pos;
			}
		}
	};
	
	this.HTMLtoXML = function( html ) {
		var results = "";
		
		HTMLParser(html, {
			start: function( tag, attrs, unary ) {
				results += "<" + tag;
		
				for ( var i = 0; i < attrs.length; i++ )
					results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
		
				results += (unary ? "/" : "") + ">";
			},
			end: function( tag ) {
				results += "</" + tag + ">";
			},
			chars: function( text ) {
				results += text;
			},
			comment: function( text ) {
				results += "<!--" + text + "-->";
			}
		});
		
		return results;
	};
	
	this.HTMLtoDOM = function( html, doc ) {
		// There can be only one of these elements
		var one = makeMap("html,head,body,title");
		
		// Enforce a structure for the document
		var structure = {
			link: "head",
			base: "head"
		};
	
		if ( !doc ) {
			if ( typeof DOMDocument != "undefined" )
				doc = new DOMDocument();
			else if ( typeof document != "undefined" && document.implementation && document.implementation.createDocument )
				doc = document.implementation.createDocument("", "", null);
			else if ( typeof ActiveX != "undefined" )
				doc = new ActiveXObject("Msxml.DOMDocument");
			
		} else
			doc = doc.ownerDocument ||
				doc.getOwnerDocument && doc.getOwnerDocument() ||
				doc;
		
		var elems = [],
			documentElement = doc.documentElement ||
				doc.getDocumentElement && doc.getDocumentElement();
				
		// If we're dealing with an empty document then we
		// need to pre-populate it with the HTML document structure
		if ( !documentElement && doc.createElement ) (function(){
			var html = doc.createElement("html");
			var head = doc.createElement("head");
			head.appendChild( doc.createElement("title") );
			html.appendChild( head );
			html.appendChild( doc.createElement("body") );
			doc.appendChild( html );
		})();
		
		// Find all the unique elements
		if ( doc.getElementsByTagName )
			for ( var i in one )
				one[ i ] = doc.getElementsByTagName( i )[0];
		
		// If we're working with a document, inject contents into
		// the body element
		var curParentNode = one.body;
		
		HTMLParser( html, {
			start: function( tagName, attrs, unary ) {
				// If it's a pre-built element, then we can ignore
				// its construction
				if ( one[ tagName ] ) {
					curParentNode = one[ tagName ];
					if ( !unary ) {
						elems.push( curParentNode );
					}
					return;
				}
			
				var elem = doc.createElement( tagName );
				
				for ( var attr in attrs )
					elem.setAttribute( attrs[ attr ].name, attrs[ attr ].value );
				
				if ( structure[ tagName ] && typeof one[ structure[ tagName ] ] != "boolean" )
					one[ structure[ tagName ] ].appendChild( elem );
				
				else if ( curParentNode && curParentNode.appendChild )
					curParentNode.appendChild( elem );
					
				if ( !unary ) {
					elems.push( elem );
					curParentNode = elem;
				}
			},
			end: function( tag ) {
				elems.length -= 1;
				
				// Init the new parentNode
				curParentNode = elems[ elems.length - 1 ];
			},
			chars: function( text ) {
				curParentNode.appendChild( doc.createTextNode( text ) );
			},
			comment: function( text ) {
				// create comment node
			}
		});
		
		return doc;
	};

	function makeMap(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	}
})();(function(exports, $wnd, $doc){

exports.$al = exports.AlloyJs = { version: '0.1.0' };


// Utils
exports.AlloyJs.utils = (function(AlloyJs, $wnd, $doc){

	function Utils(){}

	Utils.prototype.isString = function(obj) {
		return Object.prototype.toString.call( obj ) == '[object String]';
	};

	Utils.prototype.isArray = function(obj) {
		return Object.prototype.toString.call( obj ) == '[object Array]';
	};

	Utils.prototype.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	};

	Utils.prototype.evaluate = function(code, ctx) {
		ctx = ctx || window;
		var result = null;
		eval('with (ctx) { result = ' + code + ' }');
		return result;
	};

	return new Utils();

})(exports.AlloyJs, $wnd, $doc);

// ObjectQuery
exports.AlloyJs.oq = (function(AlloyJs, $wnd, $doc){

	function ObjectQuery(){}

	ObjectQuery.prototype.get = function(id, ctx) {
		ctx = ctx || window;

		var ns = ('ctx.' + id).split('.');
		var obj = null;

		var tmp = { ctx: ctx };

		for(var i = 0; i < ns.length; i++){
			if(tmp[ns[i]]){
				tmp = tmp[ns[i]];
			} else if(tmp[ns[i]] === null){
				tmp = tmp[ns[i]];
			}
		}

		return tmp;
	};		

	return new ObjectQuery();

})(exports.AlloyJs, $wnd, $doc);

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

// ===================== Proxies =====================

function ArrayProxy(handler, original) {
	var self = this;
   	this.original = original;

   	["push", 
   	 "pop", 
   	 "concat", 
   	 "every", 
   	 "filter", 
   	 "forEach", 
   	 "indexOf", 
   	 "join", 
   	 "lastIndexOf", 
   	 "map", 
   	 "pop", 
   	 "push", 
   	 "reduce", 
   	 "reduceRight", 
   	 "reverse", 
   	 "shift", 
   	 "slice", 
   	 "some", 
   	 "sort", 
   	 "splice", 
   	 "unshift", 
   	 "isArray"].forEach(function(fn){
   		eval('self.'+fn+' = function() { var value = self.original.'+fn+'.apply(self.original, arguments); handler(); return value; };');
   	});

	Object.defineProperty(this, 'length', {
	    get: function(){ return self.original.length; },
	    set: function(value){ self.original.length = value; }
	});
}

// ===================== end Proxies =====================

// ObjectBinder
exports.AlloyJs.ob = (function(AlloyJs, $wnd, $doc){

	function ObjectBinder(){}

	var cache = {};

	function createArrayProxy(expression, callback, oldObject, ctx) {
		var newArray = null;
		eval('with(ctx) { newArray = new ArrayProxy(function(){callback('+expression+')}, oldObject); }');
		return newArray;
	}

	ObjectBinder.prototype.prop = function(id, getter, setter, ctx) {
		ctx = ctx || window;

		Object.defineProperty(ctx, id, {
		    get: getter,
		    set: setter
		});
	}

	ObjectBinder.prototype.bind = function(id, getter, setter, ctx) {
		var self = this;
		ctx = ctx || window;

		var result = $al.oq.get(id);
		if(result !== undefined) {
			var parts = ('ctx.' + id).split('.');
			var target = ('ctx.' + id).substr(0, ('ctx.' + id).lastIndexOf('.'));
			var prop = parts[parts.length - 1];

			eval('var propObject = ' + target + '.' + prop);
			eval('var targetObject = ' + target);
			if(propObject != undefined) {
				if($al.utils.isArray(targetObject)) {
					eval(target + ' = createArrayProxy(id, setter, targetObject, ctx)');
				} else {
					eval('cache[prop] = ' + target + '.' + prop);

					var isThisObj = false;
					eval('isThisObj = delete ' + target + '.' + prop);

					if(isThisObj) {
						var codeGetterSetter = 'self.prop("' + prop + '", function() { return getter(cache[prop]) || cache[prop]; }, function(__value){ cache[prop] = __value; setter(__value); }, ' + target + ')';
						eval(codeGetterSetter);
					} else {
						// TODO:
					}
				}
			} else {
				throw new Error('can\'t bind undefined object');
			}
		} else {
			throw new Error('can\'t bind undefined object');
		}
	};		

	return new ObjectBinder();

})(exports.AlloyJs, $wnd, $doc);

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

	self.parser.extractProperty(html);

	for(var i = 0; i < self.binds.length; i++){
		var bind = self.binds[i];
		html = html.replace(new RegExp('\{\{' + bind.property + '\}\}'), '<span id="_' + bind.html_id + '"></span>');
		eval('pubSub.on(ctx, bind.html_id, function(id, value){ '
			+ 'var el = self.hq.get("_" + id); '
			+ 'el.textContent = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) ); '
			+ 'el.innerText = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) ); '
		+ ' });');
	}

	el.innerHTML = html;

	for(var i = 0; i < self.binds.length; i++){
		var bind = self.binds[i];

		var el = self.hq.get('_' + bind.html_id);

		eval('el.textContent = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) )');
		eval('el.innerText = self.applyStr( self.utils.evaluate( "' + bind.property + '", ctx) )');

		eval('self.ob.bind("' + bind.property + '", '
			+ 'function(value){ return value; }, '
			+ 'function( value ){ pubSub.trigger(ctx, "' + bind.html_id + '", value); }, ctx );');
	}
}



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