var linkScriptES6 = './script/script.js'
var linkScriptES5 = './script/script_IE.js'

function browser_name() {
	var browser_id = navigator.userAgent;
	if (browser_id.search(/MSIE/) != -1 || browser_id.search(/Trident/) != -1) return 'IE';
}

function connectScript() {
	var parent = document.querySelector('body')
	var newScript = document.createElement("script");
	newScript.type = "text/javascript";
	// console.dir(newScript);
	
	if (browser_name() != 'IE') {
		newScript.src = linkScriptES6;
		parent.appendChild(newScript)
	} else {
		newScript.src = linkScriptES5;
		parent.appendChild(newScript)
	}

}
connectScript()