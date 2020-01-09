

function browser_name() {
	var browser_id = navigator.userAgent;
	if (browser_id.search(/MSIE/) != -1 || browser_id.search(/Trident/) != -1) return 'IE';
}

function connectScript() {
	var linkScriptES6 = './script/script.js'
	var linkScriptES5 = './script/script_IE.js'
	var parent = document.querySelector('body')
	var newScript = document.createElement('script');
	newScript.type = "text/javascript";
	if (browser_name() != 'IE') {
		newScript.src = linkScriptES6;
		parent.appendChild(newScript)
	} else {
		newScript.src = linkScriptES5;
		parent.appendChild(newScript)
	}
}
connectScript()
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkZXRlcm1pbmFudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmZ1bmN0aW9uIGJyb3dzZXJfbmFtZSgpIHtcclxuXHR2YXIgYnJvd3Nlcl9pZCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblx0aWYgKGJyb3dzZXJfaWQuc2VhcmNoKC9NU0lFLykgIT0gLTEgfHwgYnJvd3Nlcl9pZC5zZWFyY2goL1RyaWRlbnQvKSAhPSAtMSkgcmV0dXJuICdJRSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbm5lY3RTY3JpcHQoKSB7XHJcblx0dmFyIGxpbmtTY3JpcHRFUzYgPSAnLi9zY3JpcHQvc2NyaXB0LmpzJ1xyXG5cdHZhciBsaW5rU2NyaXB0RVM1ID0gJy4vc2NyaXB0L3NjcmlwdF9JRS5qcydcclxuXHR2YXIgcGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXHJcblx0dmFyIG5ld1NjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cdG5ld1NjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuXHRpZiAoYnJvd3Nlcl9uYW1lKCkgIT0gJ0lFJykge1xyXG5cdFx0bmV3U2NyaXB0LnNyYyA9IGxpbmtTY3JpcHRFUzY7XHJcblx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQobmV3U2NyaXB0KVxyXG5cdH0gZWxzZSB7XHJcblx0XHRuZXdTY3JpcHQuc3JjID0gbGlua1NjcmlwdEVTNTtcclxuXHRcdHBhcmVudC5hcHBlbmRDaGlsZChuZXdTY3JpcHQpXHJcblx0fVxyXG59XHJcbmNvbm5lY3RTY3JpcHQoKVxyXG4iXSwiZmlsZSI6ImRldGVybWluYW50LmpzIn0=
