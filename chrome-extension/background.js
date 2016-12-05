var active = false;
var config = {
	mode: 'system'
};

function addDesktopAgent(details)
{
	for(var i=0; i<details.requestHeaders.length; ++i)
	{
		if(details.requestHeaders[i].name === "User-Agent")
		{
			var agent = localStorage.getItem("desktop_agent");
			if(agent.length > 5)
			{
				details.requestHeaders[i].value = agent;
			}

			break;
		}
	}
	return {requestHeaders: details.requestHeaders};
}

function addMobileAgent(details)
{
	for(var i=0; i<details.requestHeaders.length; ++i)
	{
		if(details.requestHeaders[i].name === "User-Agent")
		{
			var agent = localStorage.getItem("mobile_agent");
			if(agent.length > 5)
			{
				details.requestHeaders[i].value = agent;
			}

			break;
		}
	}
	return {requestHeaders: details.requestHeaders};
}

function addDefaultAgent(details)
{
	for(var i=0; i<details.requestHeaders.length; ++i)
	{
		if(details.requestHeaders[i].name === "User-Agent")
		{
			var agent = localStorage.getItem("default_agent");
			if(agent.length > 5)
			{
				details.requestHeaders[i].value = agent;
			}

			break;
		}
	}
	return {requestHeaders: details.requestHeaders};
}

function crawl()
{
	var desktop_id = 0;
	var mobile_id = 0;
	var cur_url = "";
	
	chrome.tabs.query({active: true}, function(tabs)
		{
			cur_url = tabs[0].url;
			
		}
	);

	setTimeout(function()
		{
			chrome.webRequest.onBeforeSendHeaders.addListener(addDesktopAgent, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);
			chrome.tabs.create({url: cur_url}, function(new_tab)
				{
					desktop_id = new_tab.id;
				}
			);
		}, 1000
	);
	chrome.webRequest.onBeforeSendHeaders.removeListener(addDesktopAgent);
	setTimeout(function()
		{
			
			chrome.webRequest.onBeforeSendHeaders.addListener(addMobileAgent, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);
			chrome.tabs.create({url: cur_url}, function(new_tab)
				{
					mobile_id = new_tab.id;
				}
			);
		}, 3000
	);
	chrome.webRequest.onBeforeSendHeaders.removeListener(addMobileAgent);

	setTimeout(function()
		{
			chrome.tabs.remove(desktop_id);
			chrome.tabs.remove(mobile_id);
		}, 5000
	);
}

function sync()
{
	chrome.storage.sync.get('desktop_agent', function(ret)
		{
			localStorage.setItem("desktop_agent", ret.desktop_agent);
		}
	);

	chrome.storage.sync.get('mobile_agent', function(ret)
		{
			localStorage.setItem("mobile_agent", ret.mobile_agent);
		}
	);

	chrome.storage.sync.get('default_agent', function(ret)
		{
			localStorage.setItem("default_agent", ret.default_agent);
		}
	);
}

sync();

chrome.proxy.settings.set({
	value: config,
	scope: 'regular'
}, function() {});

chrome.browserAction.setIcon({path: "inactive.png"});

chrome.browserAction.onClicked.addListener(function(tab) { 
	if(active)
	{
		sync();
		active = false;
		chrome.browserAction.setIcon({path: "inactive.png"});

		var config = {
			mode: 'system'
		};
		chrome.proxy.settings.set({
			value: config,
			scope: 'regular'
	    }, function() {});

		if(chrome.webRequest.onBeforeSendHeaders.hasListener(addDesktopAgent))
		{
			chrome.webRequest.onBeforeSendHeaders.removeListener(addDesktopAgent);
		}
		if(chrome.webRequest.onBeforeSendHeaders.hasListener(addMobileAgent))
		{
			chrome.webRequest.onBeforeSendHeaders.removeListener(addMobileAgent);
		}
		if(chrome.webRequest.onBeforeSendHeaders.hasListener(addDefaultAgent))
		{
			chrome.webRequest.onBeforeSendHeaders.removeListener(addDefaultAgent);
		}
	}
	else
	{
		sync();
		active = true;
		chrome.browserAction.setIcon({path: "active.png"});

		var config = {
			mode: 'fixed_servers',
			rules: {
				singleProxy: {
				    host: '127.0.0.1',
					port: 8080
				}
			}
		};
		chrome.proxy.settings.set({
			value: config,
			scope: 'regular'
	    }, function() {});

		//crawl();

		if(chrome.webRequest.onBeforeSendHeaders.hasListener(addDefaultAgent))
		{
			chrome.webRequest.onBeforeSendHeaders.removeListener(addDefaultAgent);
		}
		chrome.webRequest.onBeforeSendHeaders.addListener(addDefaultAgent, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);	

	}

});




