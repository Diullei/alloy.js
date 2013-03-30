
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

   	 self.getOriginal = function(){
   	 	return self.original;
   	 }

	Object.defineProperty(this, 'length', {
	    get: function(){ return self.original.length; },
	    set: function(value){ self.original.length = value; }
	});
}

function StringProxy(handler, original) {
	var self = this;
   	this.original = original;

   	["charAt", 
   	 "charCodeAt", 
   	 "concat", 
   	 "fromCharCode", 
   	 "indexOf", 
   	 "lastIndexOf", 
   	 "match", 
   	 "replace", 
   	 "search", 
   	 "slice", 
   	 "split", 
   	 "substr", 
   	 "substring", 
   	 "toLowerCase", 
   	 "toUpperCase", 
   	 "valueOf"].forEach(function(fn){
   		eval('self.'+fn+' = function() { var value = self.original.'+fn+'.apply(self.original, arguments); handler(); return value; };');
   	});

   	 self.getOriginal = function(){
   	 	return self.original;
   	 }

	Object.defineProperty(this, 'length', {
	    get: function(){ return self.original.length; },
	    set: function(value){ self.original.length = value; }
	});
}

function DateProxy(handler, original) {
	var self = this;
   	this.original = original;

   	["getDate", 
   	 "getDay", 
   	 "getFullYear", 
   	 "getHours", 
   	 "getMilliseconds", 
   	 "getMinutes", 
   	 "getMonth", 
   	 "getSeconds", 
   	 "getTime", 
   	 "getTimezoneOffset", 
   	 "getUTCDate", 
   	 "getUTCDay", 
   	 "getUTCFullYear", 
   	 "getUTCHours", 
   	 "getUTCMilliseconds",
   	 "getUTCMinutes",
   	 "getUTCMonth",
   	 "getUTCSeconds",
   	 "parse",
   	 "setDate",
   	 "setFullYear",
   	 "setHours",
   	 "setMilliseconds",
   	 "setMinutes",
   	 "setMonth",
   	 "setSeconds",
   	 "setTime",
   	 "setUTCDate",
   	 "setUTCFullYear",
   	 "setUTCHours",
   	 "setUTCMinutes",
   	 "setUTCMonth",
   	 "setUTCSeconds",
   	 "toDateString",
   	 "setYear",
   	 "toISOString",
   	 "toJSON",
   	 "toLocaleDateString",
   	 "toLocaleTimeString",
   	 "toLocaleString",
   	 "toString",
   	 "toTimeString",
   	 "toUTCString",
   	 "UTC",
   	 "valueOf",
   	 "valueOf"].forEach(function(fn){
   		eval('self.'+fn+' = function() { var value = self.original.'+fn+'.apply(self.original, arguments); handler(); return value; };');
   	});

   	 self.getOriginal = function(){
   	 	return self.original;
   	 }
}

// ===================== end Proxies =====================
