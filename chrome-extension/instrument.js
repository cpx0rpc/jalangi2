var code = localStorage.getItem("inst");

function whenAvailable(name, cb) {
	var interval = 100;
	window.setTimeout(function() {
		if(window[name]) {
			cb(window[name]);
		} else {
			window.setTimeout(arguments.callee, interval);
		} 
	}, interval);
}

whenAvailable("J$", function()
{
	var script = document.createElement('script');
	script.textContent = code;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
});


