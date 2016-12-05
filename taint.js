(function()
{
	//Taint
	var threshold = 100;
	var taintsrc = [];

	isTainted = function(src)
	{
		if(taintsrc.indexOf(src) > -1) return true;
		else return false;
	}

	taint = function(src)
	{
		//console.log(typeof src);
		if(taintsrc.length < threshold)
		{
			if(typeof src == "string")
			{
				if(src.length > 5)
				{
					taintsrc.push(src);
				}
			}
			else if(typeof src == "number")
			{
				taintsrc.push(src);
			}
		}

		return taintsrc.length;
	}

	getCode = function(sid, iid)
	{
		var code = "";
		if(J$.smap[sid])
		{
			code = J$.smap[sid].code;
		}

		var loc = J$.iidToLocation(J$.getGlobalIID(iid));
		loc = loc.split(":");
		var line = parseInt(loc[3])-1;
		code = code.split(/\n|\r/g);
		if(code[line] != undefined)
		{
			if(code[line].length < 100)
			{
				return line.toString() + ": " + code[line];
			}
			else
			{
				return "Code is too long. Omitted."
			}
		}
		else
		{
			return "Code is Undefined.";
		}
	}
	

	//global var here

	J$.analysis = 
	{
		binary : function(iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed)
		{
			if(isTainted(left) || isTainted(right))	
			{
				taint(result);
				console.log("[TAINTED] binary op: " + result + " <= " + left + " + " + right); 
				console.log("[CODE] " + getCode(J$.sid, iid));
			}
		},

		getField : function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall)
		{
			//Predefined taint source
			if((base instanceof HTMLInputElement || base instanceof HTMLTextAreaElement) && offset == "value")
			{
				//Form inputs
				if(val.toString().length > 5)
				{
					taint(val);
					console.log("[TAINTED] getField: " + base + "." + offset + " <= " + val); 
					console.log("[CODE] " + getCode(J$.sid, iid));
				}
			}
			if(base instanceof Window && offset == "location")
			{
				//URL inputs
				if(val.toString().length > 5)
				{
					taint(val);
					console.log("[TAINTED] getField: " + base + "." + offset + " <= " + val); 
					console.log("[CODE] " + getCode(J$.sid, iid));
				}		
			}
			if(base instanceof HTMLDocument && offset == "cookie")
			{
				//Cookie
				if(val.toString().length > 5)
				{
					taint(val);
					console.log("[TAINTED] getField: " + base + "." + offset + " <= " + val); 
					console.log("[CODE] " + getCode(J$.sid, iid));
				}
			}
		},

		invokeFun : function(iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid)
		{
			for(var i=0; i<args.length; i++)
			{
				if(isTainted(args[i]))
				{
					taint(result);

					if(f.name == "submit")
					{
						console.log("[LEAKAGE] " + args[i] + " is submitted to " + base.action + " through " + base + "." + f.name); 
						console.log("[CODE] " + getCode(J$.sid, iid));
						alert("[LEAKAGE] " + args[i] + " is submitted to " + base.action + " through " + base + "." + f.name); 
					}
					else if(f.name == "open" && args[0] == "GET")
					{
						console.log("[LEAKAGE] " + args[i] + " is requested through " + base + "." + f.name + " to " + args[1]); 
						console.log("[CODE] " + getCode(J$.sid, iid));
						alert("[LEAKAGE] " + args[i] + " is requested through " + base + "." + f.name + " to " + args[1]); 
					}
					else
					{
						console.log("[TAINTED] invokeFun: " + args[i] + " is passed through " + f.name);
						console.log("[CODE] " + getCode(J$.sid, iid));
					}
				}
			}
		},

		putField : function(iid, base, offset, val, isComputed, isOpAssign)
		{
			if(isTainted(val))
			{
				if(offset == "src")
				{
					//Malicious image
					console.log("[LEAKAGE] " + val + " is sent through image " + base + "." + offset); 
					console.log("[CODE] " + getCode(J$.sid, iid));
					alert("[LEAKAGE] " + val + " is sent through image " + base + "." + offset);
				}
				else if(offset == "location" || offset == "href")
				{
					//Direct URL
					console.log("[LEAKAGE] " + val + " is redirected through " + base + "." + offset); 
					console.log("[CODE] " + getCode(J$.sid, iid));
					alert("[LEAKAGE] " + val + " is redirected through " + base + "." + offset); 
				}
			}
		},

		unary : function(iid, op, left, result)
		{
			if(isTainted(left))
			{
				taint(result);

				console.log("[TAINTED] unary op: " + result + " <= " + left); 
				console.log("[CODE] " + getCode(J$.sid, iid));
			}
		}
	};
}());
