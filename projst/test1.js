
//清除空格(性能差)
function cleanWhitespace(element){
    element = element || document;  //不提供参数，则处理整个HTML文档
    var cur = element.firstChild;   //从第一个子节点开始
    while(cur != null){
        //如果节点是文本节点，并且只包含空格
        if(cur.nodeType == 3 && ! /\S/.test(cur.nodeValue)){
            element.removeChild(cur);   //删除
        }else if(cur.nodeType == 1){
            //如果它是一个元素，则递归清除空格
            cleanWhitespace(cur);
        }
        cur = cur.nextSibling;  //遍历子节点
    }
}
function id(name){
    return document.getElementById(name);
}                                      
function tag(name,elem){
    return (elem || document).getElementsByTagName(name);
}
function prev(elem){
    do{
        elem = elem.previousSibling;
    }while(elem && elem.nodeType != 1);
    return elem;
}
function next(elem){
    do{
        elem = elem.nextSibling;
    }while(elem && elem.nodeType !=1);
    return elem;
}
function first(elem){
    elem = elem.firstChild;
    return elem && elem.nodeType != 1 ? next(elem) : elem;
}
function last(elem){
    elem = elem.lastChild;
    return elem && elem.nodeType != 1 ? prev(elem) : elem;
}
// parent(elem,2) 等同于 parent(parent(elem)) 
function parent(elem,num){
    num = num || 1;
    for(var i=0;i<num;i++){
        if(elem != null){
            elem = elem.parentNode;
        }
    }
    return elem;
}
function hasClass(name,type){
    var r = [];
    var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
    var e = document.getElementsByTagName(type || "*");
    for(var j=0;j<e.length;j++){
        if(re.test(e[j].className)){
            r.push(e[j]);
        }
    }
    return r;
}
//获取元素内容
function text(e){
    var t = '';
    e = e.childNodes || e;
    for(var j=0;j<e.length;j++){
        t += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes);
    }
    return t;
}
//是否有属性
function hadAttribute(elem,name){
    return elem.getAttribute(name) != null;
}
//获取和设置元素的属性的值
function attr(elem,name,value){
    //确保提供的name是正确的
    if(!name || name.constructor != String){
        return '';
    }    
    //检查name是否处在怪异命名的情形中
    name = {'for':'htmlFor','class':'className'}[name] || name;
    if(typeof value != 'undefined'){
        //首先使用快捷方式
        elem[name] = value;
        if(elem.setAttribute){
            elem.setAttribute(name,value)
        }
    }
    return elem[name] || elem.getAttribute(name) || '';
}
//删除dom节点
function remove(elem){
    if(elem){
        elem.parentNode.removeChild(elem);
    }
}
//清空子节点
function empty(elem){
    while(elem.firstChild){
        remove(elem.firstChild);
    }
}
//获取元素的真实、最终的CSS样式属性值
function getStyle(elem,name){
    if(elem.style[name]){
        //如果属性存在于style[]中，那么它已经被设置了（并且是当前的）
        return elem.sytle[name];
    }else if(elem.currentStyle){
        //否则，尝试使用IE的方法
        return elem.currentStyle[name];
    }else if(document.defaultView && document.defaultView.getComputedStyle){
        //W3C方法
        //它使用的是通用的‘text-align’有样式规则而非‘textAlign’
        name = name.replace(/([A-Z])/g,"-$1");
        name = name.toLowerCase();
        var s = document.defaultView.getComputedStyle(elem,'');
        return s && s.getPropertyValue(name);
    }else {
        return null;
    }
}
//阻止事件冒泡 page95
function stopBubble(e){
    //如果传入e，是非IE浏览器
    if(e && e.stopPropagation){
        e.stopPropagation();
    }else{
        window.event.cancelBubble = true;
    }
}
//防止发生默认浏览器行为
function stopDefault(e){
    //W3C
    if(e && e.preventDefault){
        e.preventDefault();
    }else{
        window.event.returnValue = false;
    }
    return false;
}
//domReady page71
function domReady(f){
    //假如Dom已经加载，立即执行
    if(domReady.done){return f();}
    if(domReady.timer){
        domReady.ready.push(f);
    }else{
        //为页面加载完毕绑定一个事件，以防止它最先完成。
        addEvent(window,'load',isDomReady);
        //初始化待执行函数的数组
        domReady.ready = [f];
        domReady.timer = setInterval(isDomReady,13);
    }
}
function isDomReady(){
    if(domReady.done){return false;}
    if(document && document.getElementsByTagName && document.getElementById && document.body){
        clearInterval(domReady.timer);
        domReady.timer = null;
        for(var i=0;i<domReady.ready.length;i++){
            domReady.ready[i]();
        }
        domReady.ready = null;
        domReady.done = true;
    }
    
}


