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

document.getElementById("b1").addEventListener("click", function()
	{
		var code = document.getElementById("c1").value;
		chrome.storage.sync.set({'inst': code});
	}
);

document.getElementById("b2").addEventListener("click", function()
	{
		chrome.storage.sync.get('inst', function(code)
			{
				document.getElementById("c1").value = code.inst;
			}
		);
	}
);

document.getElementById("b3").addEventListener("click", function()
	{
		chrome.devtools.inspectedWindow.reload({ignoreCache: true});
	}
);

document.getElementById("b4").addEventListener("click", function()
	{
		var agent = document.getElementById("c2").value;
		chrome.storage.sync.set({'desktop_agent': agent});
	}
);

document.getElementById("b5").addEventListener("click", function()
	{
		chrome.storage.sync.get('desktop_agent', function(ret)
			{
				document.getElementById("c2").value = ret.desktop_agent;
			}
		);
	}
);

document.getElementById("b6").addEventListener("click", function()
	{
		var agent = document.getElementById("c3").value;
		chrome.storage.sync.set({'mobile_agent': agent});
	}
);

document.getElementById("b7").addEventListener("click", function()
	{
		chrome.storage.sync.get('mobile_agent', function(ret)
			{
				document.getElementById("c3").value = ret.mobile_agent;
			}
		);
	}
);

document.getElementById("b8").addEventListener("click", function()
	{
		var agent = document.getElementById("c4").value;
		chrome.storage.sync.set({'default_agent': agent});

		sync();
		if(chrome.webRequest.onBeforeSendHeaders.hasListener(addDefaultAgent))
		{
			chrome.webRequest.onBeforeSendHeaders.removeListener(addDefaultAgent);
		}
		chrome.webRequest.onBeforeSendHeaders.addListener(addDefaultAgent, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);	
	}
);

document.getElementById("b9").addEventListener("click", function()
	{
		chrome.storage.sync.get('default_agent', function(ret)
			{
				document.getElementById("c4").value = ret.default_agent;

			}
		);
	}
);
