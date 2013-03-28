var fs = require("fs");
var path = require("path");
var compressor = require('node-minify');

// values
var version = "0.1.0";
var defaultFileName = 'alloy-' + version + '.js';
var minFileName = 'alloy-' + version + '.min.js';
var sourceFiles = "src";

// files
var copyrightNotice = "CopyrightNotice.txt";
var compilerSources = [
	"external/htmlparser.js",
	"start.js",
	"utils.js",
	"objectQuery.js",
	"htmlQuery.js",
	"parser.js",
	"objectBinder.js",
	"core.js",
	"end.js"
].map(function (f) {
	return path.join(sourceFiles, f);
});

desc("Build alloy.js file");
task('default', function () {
	var source = '';

	for(var i = 0; i < compilerSources.length; i++){
		source += readFile(compilerSources[i]);
	}

	var copyright = readFile(copyrightNotice);
	
	var defaultSource = copyright + source;
	var minSource = copyright + source;

	writeFile(defaultFileName, defaultSource);

	new compressor.minify({
	    type: 'yui-js',
	    fileIn: defaultFileName,
	    fileOut: minFileName,
	    callback: function(err){
	        if(err){
	        	throw new Error(err);
	        } else {
				var source = readFile(minFileName);
				var copyright = readFile(copyrightNotice);
				writeFile(minFileName, copyright + source);
	        }
	    }
	});

});

function replace(oldValue, newValue, text) {
	while(text.indexOf(oldValue) != -1) {
		text = text.replace(oldValue, newValue);
	}
	return text;
}

function readFile(file) {
	var content = fs.readFileSync(file, 'utf8');
	content = replace("==VERSION==", version, content);
	return content;
}

function writeFile(name, content) {
	fs.writeFileSync(name, content);
}