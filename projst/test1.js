
//清除空格(性能差)
/*function cleanWhitespace(element){
    element = element || document;  //不提供参数，则处理整个HTML文档
    var cur = element.firstChild;   //从第一个子节点开始
    while(cur !== null){
        //如果节点是文本节点，并且只包含空格
        if(cur.nodeType == 3 && ! /\S/.test(cur.nodeValue)){
            element.removeChild(cur);   //删除
        }else if(cur.nodeType == 1){
            //如果它是一个元素，则递归清除空格
            cleanWhitespace(cur);
        }
        cur = cur.nextSibling;  //遍历子节点
    }
}*/

//基本Dom操作
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
        if(elem !== null){
            elem = elem.parentNode;
        }
    }
    return elem;
}
function hasClass(name,type){
    var r = [];
    var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
    var e = document.getElementsByTagName(type || "*");
    var e_length = e.length;
    for(var j=0;j<e_length;j++){
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
    return elem.getAttribute(name) !== null;
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
            elem.setAttribute(name,value);
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
    return null;
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
    return null;
}

/**
 * 第7章 JavaScript与CSS
 */

//获取元素的真实、最终的CSS样式属性值 page108
function getStyle(elem,name){
    if(elem.style[name]){
        //如果属性存在于style[]中，那么它已经被设置了（并且是当前的）
        return elem.style[name];
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
//获取元素的X(水平，左端)位置
function pageX (elem) {
    return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;
}
//获取元素的Y(垂直，顶端)位置
function pageY (elem) {
    return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;
}
//获取元素相对父亲的水平位置
function parentX (elem) {
    return elem.parentNode == elem.offsetParent ? elem.offsetLeft : pageX(elem) - pageX(elem.parentNode);
}
//获取元素相对父亲的垂直位置
function parentY (elem) {
    return elem.parentNode == elem.offsetParent ? elem.offsetTop : pageY(elem) - pageY(elem.parentNode);
}
//查找元素左端位置
function posX (elem) {
    return parseInt(getStyle(elem,'left'),10);
}
//查找元素顶端位置
function posY (elem) {
    return parseInt(getStyle(elem,'top'),10);
}
//设置元素位置
function setX (elem, pos) {
    elem.style.left = pos + 'px';
}
function setY (elem, pos) {
    elem.style.top = pos + 'px';
}
//增加元素距离
function addX (elem, pos) {
    setX(posX(elem) + pos);
}
function addY (elem, pos) {
    setY(posY(elem) + pos);
}
//获取元素真实宽度和高度
function getWidth (elem) {
    return parseInt(getStyle(elem,'width'),10);
}
function getHeight (elem) {
    return parseInt(getStyle(elem,'height'),10);
}
function resetCSS (elem, prop) {
    var old = {};
    //遍历每一个属性
    for(var i in prop) {
        //记录旧的属性
        old[i] = elem.style[i];
        //并设置新的值
        elem.style[i] = prop[i];
        //返回已经变化的值的集合
        return old;
    }
    return null;
}
function restoreCSS (elem, prop) {
    //重置所有属性，恢复它们的原有值
    for(var i in prop) {
        elem.style[i] = prop[i];
    }
    return null;
}
//获取元素完整的、可能的宽度和高度
function fullWidth (elem) {
    //如果元素是显示的，那么使用offsetWidth就能等到宽度，如果没有offsetWidth，则使用getWidth()
    if(getStyle(elem, 'display') != 'none') {
        return elem.offsetWidth || getWidth(elem);
    }
    //否则，我们必须处理display为none的元素，所以重置它的CSS的属性以获取更精确的读数
    var old = resetCSS(elem, {
        display : '',
        visibility : 'hidden',
        position : 'obsolute'
    });
    //使用clientWidth找出元素的完整宽度，如果还不生效，则使用getWidth()
    var w = elem.clientWidth || getWidth(elem);
    //恢复CSS的原貌属性
    restoreCSS(elem, old);
    return w;
}
function fullHeight (elem) {
    if(getStyle(elem, 'display') != 'none') {
        return elem.offsetHeight || getHeight(elem);
    }
    var old = resetCSS(elem, {
        display : '',
        visibility : 'hidden',
        position : 'obsolute'
    });
    var h = elem.clientHeight || getHeight(elem);
    restoreCSS(elem,old);
    return h;
}
//切换元素的可见性
function hide (elem) {
    //找出元素display的当前状态
    var curDisplay = getStyle(elem, 'display');
    //记录它的display状态
    if(curDisplay != 'none') {
        elem.$oldDisplay = curDisplay;
        elem.style.display = 'none';
    }
}
function show (elem) {
    //设置display属性为它的原始值，如没有记录原始值，则使用block
    elem.style.display = elem.$oldDisplay || 'block';
}
//调节元素透明度
function setOpacity (elem, level) {
    if(elem.filters) {
        //如果存在filters，则它是IE，所以设置元素的Alpha滤镜
        elem.style.filter = 'alpha(opacity='+ level +')';
    }else {
        //否则，使用W3C的opacity属性
        elem.style.opacity = level/100;
    }
}
//向下滑动 page 119
function slideDown (elem) {
    var h = fullHeight(elem);
    elem.style.height = '0px';
    show(elem);
    for (var i = 0; i <= 100; i++) {
        (function () {
            var pos = i;
            setTimeout(function() {
                elem.style.height = ((pos/100) * h) + 'px';
            }, (pos+1) * 10);
        })();
    }
}
//渐显
function fadeIn (elem) {
    setOpacity(elem, 0);
    show(elem);
    for (var i = 0; i <= 100; i++) {
        (function () {
            var pos = i;
            setTimeout(function() {
                setOpacity(elem, pos);
            }, (pos+1) * 10);
        })();
    }
}
//渐隐
function fadeOut (elem) {
    for (var i = 100; i >= 0; i--) {
        (function () {
            var pos = i;
            setTimeout(function() {
                setOpacity(elem, pos);
            }, (101-pos) * 10);
        })();
    }
}
//获取鼠标相对于整个页面的当前位置 page 120
function getX (e) {
    e = e || window.event;
    return e.pageX || e.clientX + document.body.scrollLeft;
}
function getY (e) {
    e = e || window.event;
    return e.pageY || e.clientY + document.body.scrollTop;
}
//获取鼠标相对于当前元素位置
function getElementX (e) {
    return (e && e.layerX) || window.event.offsetX;
}
function getElementY (e) {
    return (e && e.layerY) || window.event.offsetY;
}
//页面尺寸
function pageWidth () {
    return document.body.scrollWidth;
}
function pageHeight () {
    return document.body.scrollHeight;
}


//--------------------------
function bug (log) {
    //console.log(log);
    //alert(log);
}
function getSty (elem,name) {
    if(elem.style[name]){
        bug('elem.style');
        return elem.style[name];
    }else if(elem.currentStyle) {
        bug('elem.currentStyle');
        return elem.currentStyle[name];
    }else if(document.defaultView && document.defaultView.getComputedStyle) {
        bug('document.defaultView');
        name = name.replace(/([A-Z])/g,"-$1");
        name = name.toLowerCase();
        var s = document.defaultView.getComputedStyle(elem,'');
        return s && s.getPropertyValue(name);
    }else{
        return null;
    }
}

