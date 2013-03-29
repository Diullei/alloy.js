
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
