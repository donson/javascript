//第十六章 客户端与服务端的通信

/*
document.cookie = 'cookie_name=value; expires=expiration_time; path=domaon_path; domain=domain_name; secure';
cookie_name 不区分大小写
value存储之前必须用encodeURIComponent()对其进行编码(decodeURIComponent()解码)
expiration_time 使用Date对象的toGMTString()方法,设置为过去的时间，立刻删除
secure为true时，表示cookie只能从安全网站（使用SSL和https的网站）中访问
*/

//var expdate = new Date();
//var date= new Date();
//var nowTime = date.getTime();
//var exptime = nowTime - (date.getHours()*3600+date.getMinutes()*60+date.getSeconds())*1000 + 86400*1000;
//expdate.setTime(exptime);
//var v = '东成';
//v = encodeURIComponent(v);
//document.cookie = 'myName='+v+'; expires='+expdate.toGMTString();
//document.cookie = 'myName2=uuuuuuuuuu; expires='+expdate.toGMTString();
//var v2 = document.cookie;
//console.debug(decodeURIComponent(v2));

function setCookie(sName, sValue, oExpires, sPath, sDomain, bSecure){
    //这里应该做一些判断，sName和sValue必须有
    var sCookie = sName + '=' + encodeURIComponent(sValue);
    if(oExpires){
        sCookie += '; expires=' + oExpires.toGMTString();
    }
    if(sPath){
        sCookie += '; path=' + sPath;
    }
    if(sDomain){
        sCookie += '; domain=' + sDomain;
    }
    if(bSecure){
        sCookie += '; secure';
    }
    document.cookie = sCookie;
}
function getCookie(sName){
    var sRE = '(?:; )?'+sName+'=([^;]*);?';
    var oRE = new RegExp(sRE);
    if(oRE.test(document.cookie)){
        return decodeURIComponent(RegExp['$1']);
    }else{
        return null;
    }
}
function deleteCookie(sName,sPath,sDomain){
    setCookie(sName,'',new Date(0),sPath,sDomain);
}

//setCookie('myName8','sd');
//console.debug(decodeURIComponent(document.cookie));
//deleteCookie('myName8');
//console.debug(decodeURIComponent(document.cookie));
//alert(getCookie('myName1'));




//公司用到的Cookies方法
//-----------------------------------------------------------------------------
var Cookies = {};
/**//**
 * 设置Cookies
 */
Cookies.set = function(name, value){
     var argv = arguments;
     var argc = arguments.length;
     var expires = (argc > 2) ? argv[2] : null;
     var path = (argc > 3) ? argv[3] : '/';
     var domain = (argc > 4) ? argv[4] : null;
     var secure = (argc > 5) ? argv[5] : false;
     document.cookie = name + "=" + escape (value) +
       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
       ((path == null) ? "" : ("; path=" + path)) +
       ((domain == null) ? "" : ("; domain=" + domain)) +
       ((secure == true) ? "; secure" : "");
};
/**//**
 * 读取Cookies
 */
Cookies.get = function(name,bUnescape){
	
	var bUnescape = (typeof(bUnescape)=="undefined")?true:false;
	
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while(i < clen){
        j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return Cookies.getCookieVal(j,bUnescape);
        i = document.cookie.indexOf(" ", i) + 1;
        if(i == 0)
            break;
    }
    return null;
};
/**//**
 * 清除Cookies
 */
Cookies.clear = function(name) {
  if(Cookies.get(name)){
    var expdate = new Date(); 
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
    Cookies.set(name, "", expdate); 
  }
};

Cookies.getCookieVal = function(offset,bUnescape){
   var endstr = document.cookie.indexOf(";", offset);
   if(endstr == -1){
       endstr = document.cookie.length;
   }
   
   if (bUnescape)
   	   return unescape(document.cookie.substring(offset, endstr));
   else 
   	   return document.cookie.substring(offset, endstr);
};

//检测客户端的COOKIE是否禁用了
function checkCookies()
{
	var result=false; 
	if(navigator.cookiesEnabled)  return true;   
	
	document.cookie = "testcookie=yes;";   
	
	var cookieSet = document.cookie;   
	
	if (cookieSet.indexOf("testcookie=yes") > -1)  result=true;   
	
	document.cookie = "";   
	
	return result;   	
}
function checkCookiesResult()
{
	var result = checkCookies();
	if (result == false)
	{
		alert('对不起，您的浏览器的Cookie功能被禁用，请开启');
	}
}
//-----------------------------------------------------------------------------






