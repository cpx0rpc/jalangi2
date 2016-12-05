chrome.storage.sync.get('inst', function(code)
	{
		localStorage.setItem("inst", code.inst);
	}
);

var s = document.createElement('script');
s.src = chrome.extension.getURL("instrument.js");
s.onload = function(){
	this.remove();
};
(document.head || document.documentElement).appendChild(s);


