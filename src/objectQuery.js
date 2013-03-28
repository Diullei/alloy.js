
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
