
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
			if(propObject) {
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
