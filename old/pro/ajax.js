/**
 *  readystatechange的5个就绪状态
 *  0   未初始化    已创建对象，但未调用open方法
 *  1   加载中      已创建对象，但未调用send方法
 *  2   已加载      已调用send方法，但状态和头信息还不可用
 *  3   交互        已经接收到部分数据
 *  4   完成        所有数据接收完毕
 *
 */








if(typeof(XMLHttpRequest) == "undefined"){
    XMLHttpRequest = function(){
        return new ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
    }; 
}
var xml = new XMLHttpRequest();
xml.onreadystatechange = function(){
    //console.log(xml.readyState);
    //console.log(xml.status);
    //console.debug(xml);
};
xml.open("GET","ajax2.html",true);
xml.send();
