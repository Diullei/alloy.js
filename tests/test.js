function regexEqual(actual, expr) {
	if(actual.match(expr)) {
		ok(true);
	} else {
		equal(actual, expr);
	}
}

module('HtmlQuery');

test( "should get element by id", function() {
	var el = $al.hq.get('qunit');

  	ok( el );
});

module('Parser');

test( "should parser a text", function() {
	var out = $al.parser.exec(
		'<p id=test>hello <i>world!', {
			start: function(out, tag, attrs, unary ) {
			    out.text += "<" + tag;
			 
			    for ( var i = 0; i < attrs.length; i++ )
			      out.text += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
			 
			    out.text += (unary ? "/" : "") + ">";
			},
			end: function(out, tag ) {
			    out.text += "</" + tag + ">";
			},
			chars: function(out, text ) {
			    out.text += text;
			},
			comment: function(out, text ) {
			    out.text += "<!--" + text + "-->";
			}
		});

  	equal( out.text, "<p id=\"test\">hello <i>world!</i></p>" );
});

test( "should extract property from template", function() {
	var tmpl = "<p id=test>{{start}}hello <i>{{name}}!</i>{{end}}</p>";
	
	$al.parser.extractProperty(tmpl);

  	equal($al.binds[0].property, 'start');
  	ok($al.binds[0].html_id);
  	equal($al.binds[1].property, 'name');
  	ok($al.binds[1].html_id);
  	equal($al.binds[2].property, 'end');
  	ok($al.binds[2].html_id);
});

module('ObjectQuery');

prop = 'prop';
prop2 = {};
prop2.name = 'prop2';

test( "should get an object", function() {
	var o = $al.oq.get('prop');
	var o2 = $al.oq.get('prop2.name');

  	equal( 'prop', o );
  	equal( 'prop2', o2 );
});

prop3 = {};
prop3.name = 'prop2';

test( "should define object getter/setter to prop3.name and set 'test' as value", function() {
	var val = null;
	$al.ob.bind('prop3.name', function(){}, function(value){
		val = value;
	});

	prop3.name = 'test';

  	equal( 'test', val );
});

prop4 = 'prop4';

test( "should define object getter/setter to prop4 and set 'test' as value", function() {
	var val = null;
	$al.ob.bind('prop4', function(){}, function(value){
		val = value;
	});

	prop4 = 'test';

  	equal( 'test', val );
});

prop5 = 'prop5';

test( "should define object getter/setter to prop5 and get the value", function() {
	$al.ob.bind('prop5', 
		function(value){
			return value + '1';
		}, 
		function( value ){
		}
	);

  	equal( 'prop51', prop5 );
});

module('Alloy Apply');

prop6 = 'prop6';

test( "should bind a prop6 object to #el_prop6 element", function() {
	$al.apply($al.oq.get('el_prop6'));

  	regexEqual($al.hq.get('el_prop6').innerHTML, /hello <i><span id="(.+)">prop6<\/span>!<\/i>/ig);
});

prop7 = 'prop7';

test( "should bind a prop7 object to #el_prop7 element and change the value", function() {
	$al.apply($al.oq.get('el_prop7'));

	prop7 = prop7 + ' changed';

  	regexEqual($al.hq.get('el_prop7').innerHTML, /hello <i><span id="(.+)">prop7 changed<\/span>!<\/i>/ig);
});

prop8 ='prop8';
prop9 = 'prop9';

test( "should bind a prop8 and prop9 object to #el_prop8 element", function() {
	$al.apply($al.oq.get('el_prop8'));
  	regexEqual($al.hq.get('el_prop8').innerHTML, /hello <i><span id="(.+)">prop8<\/span>!<\/i><span id="(.+)">prop9<\/span>/ig);
  	prop8 = 'foo';
  	regexEqual($al.hq.get('el_prop8').innerHTML, /hello <i><span id="(.+)">foo<\/span>!<\/i><span id="(.+)">prop9<\/span>/ig);
  	prop9 = 'bar';
  	regexEqual($al.hq.get('el_prop8').innerHTML, /hello <i><span id="(.+)">foo<\/span>!<\/i><span id="(.+)">bar<\/span>/ig);
});

prop10 = 'prop10*';
prop11 = 'prop11*';
prop12 = 'prop12*';
prop13 = 'hello ${prop10}-${prop11}-${prop12}';

test( "should bind a prop13 object to #el_prop13 element and render the value with template string", function() {
	$al.apply($al.oq.get('el_prop13'));

  	regexEqual($al.hq.get('el_prop13').innerHTML, /hello <i><span id="(.+)">hello prop10\*\-prop11\*\-prop12\*<\/span>!<\/i>/ig);
});

prop14 = ["a", "b", "c"];

test( "should bind a prop14 object to #el_prop14 element and evaluate the value", function() {
	$al.apply($al.oq.get('el_prop14'));

  	regexEqual($al.hq.get('el_prop14').innerHTML, /hello <i><span id="(.+)">3<\/span>!<\/i>/ig);

  	prop14.push("d");

	regexEqual($al.hq.get('el_prop14').innerHTML, /hello <i><span id="(.+)">4<\/span>!<\/i>/ig);  	
});
