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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkZXRlcm1pbmFudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbGlua1NjcmlwdEVTNiA9ICcuL3NjcmlwdC9zY3JpcHQuanMnXHJcbnZhciBsaW5rU2NyaXB0RVM1ID0gJy4vc2NyaXB0L3NjcmlwdF9JRS5qcydcclxuXHJcbmZ1bmN0aW9uIGJyb3dzZXJfbmFtZSgpIHtcclxuXHR2YXIgYnJvd3Nlcl9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblx0aWYgKGJyb3dzZXJfaWQuc2VhcmNoKC9NU0lFLykgIT0gLTEgfHwgYnJvd3Nlcl9pZC5zZWFyY2goL1RyaWRlbnQvKSAhPSAtMSkgcmV0dXJuICdJRSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbm5lY3RTY3JpcHQoKSB7XHJcblx0dmFyIHBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKVxyXG5cdHZhciBuZXdTY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cdG5ld1NjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuXHQvLyBjb25zb2xlLmRpcihuZXdTY3JpcHQpO1xyXG5cdFxyXG5cdGlmIChicm93c2VyX25hbWUoKSAhPSAnSUUnKSB7XHJcblx0XHRuZXdTY3JpcHQuc3JjID0gbGlua1NjcmlwdEVTNjtcclxuXHRcdHBhcmVudC5hcHBlbmRDaGlsZChuZXdTY3JpcHQpXHJcblx0fSBlbHNlIHtcclxuXHRcdG5ld1NjcmlwdC5zcmMgPSBsaW5rU2NyaXB0RVM1O1xyXG5cdFx0cGFyZW50LmFwcGVuZENoaWxkKG5ld1NjcmlwdClcclxuXHR9XHJcblxyXG59XHJcbmNvbm5lY3RTY3JpcHQoKVxyXG4iXSwiZmlsZSI6ImRldGVybWluYW50LmpzIn0=
