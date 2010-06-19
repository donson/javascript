//第七章 正则表达式

/*
-------------------------
\t      制表符
\n      制造符
\r      回车符
\f      换页符
\a      alert字符
\e      escape字符
\cX     与X相对应的控制字符
\b      回退字符
\v      垂直制表符
\0      空白字符
-------------------------
.       [^\n\r]         除了换行和回车之外的任意字符
\d      [0-9]           数字
\D      [^0-9]          非数字
\s      [ \t\n\x0B\f\r]     空白字符
\S      [^ \t\n\x0B\f\r]    非空白字符
\w      [a-zA-Z_0-9]    单词字符（所有的字母、数字和下划线）    
\W      [^a-zA-Z_0-9]   非单词字符
-------------------------
?       出现0次或一次
+       出现1次或多次
*       出现0次或多次
{n}     一定出现n次
{n,m}   至少出现n次但不超过m次
{n,}    至少出现n次
-------------------------
^       行开头
$       行结尾
\b      单词边界
\B      非单词边界
-------------------------
*/



//var reCat = new RegExp('cat','ig');
//var str = 'sfdCat sdfkkcat ccat';
//alert(reCat.test(str));               //test 返回true or false
//console.debug(/c(at)/g.exec(str));   //exec 返回一个数组，数组中第一个是第一个匹配
//console.debug(str.match(reCat));  //match 返回一个包含在字符串中的所有匹配的数组
//console.debug(str.search(reCat)); //search 返回在字符串第一次出现的位置，g不起作用


//var str2 = 'This sky is red.';
//alert(str2.replace(/red/,'blue'));
//alert(str2.replace(/s/g,'a'));
//var i = 1;
//alert(str2.replace(/s/g,function(word){
//    console.debug(arguments);
//    var ar = arguments;
//    return word + i++ + '_' + ar[1];
//}));

//var str2 = 'div#dsf.ccc.ddd';
//alert(str2.replace(/red/,'blue'));
//alert(str2.replace(/s/g,'a'));
//var i = 1;
//alert(str2.replace(/([\w]+)(#[\w]+)?((?:\.[\w]+)*)?/ig,function(word){
//    console.debug(arguments);
//    var ar = arguments;
//    return word + i++ + '_' + ar[1];
//}));


//var name = "Doe, John";
//alert(name.replace(/(\w+)\s*, \s*(\w+)/, "$2 $1"));


//var str3 = '"dsfs", "sdfsd"';
//alert(str3.replace(/"([^"]*)"/g,"'$1'"));


//name = 'aaa bbb ccc';
//uw=name.replace(/\b\w+\b/g, function(word){
//    console.debug(word);
//    return word.substring(0,1).toUpperCase()+word.substring(1);}
//);
//alert(uw);


//var str4 = 'donson, donson86, donson86@gmail.com';
//var str4_d = str4.split(/\s*\,\s*/);
//console.debug(str4_d);


//var str = 'sdfCat, bat, Nat, iisdfat, Aat';
//console.debug(str.match(/[abc]at/gi));


//var str5 = ' dfs dfs sf sf        ';
//var reSpace = /^\s+|\s+$/g;     //trim 去掉头尾空白 速度快一点...
//console.debug(str5.replace(reSpace, ''));
//var reSpace = /^\s*(.*?)\s+$/;     //trim 去掉头尾空白
//console.debug(str5.replace(reSpace, function(){console.debug(arguments);return arguments[1]}));
//str5.replace(reSpace, '$1');


//var s = '#323322';
//var re = /#(\d*)/;
//re.test(s);
//alert(RegExp.$2);


//var str6 = 'sdfvb sdbdsb bb sfb';
//var rb = /b/g;
//rb.exec(str6);
//rb.exec(str6);
//console.debug(rb.lastIndex);
//rb.lastIndex = 0;
//rb.exec(str6);
//console.debug(rb.lastIndex);


//var re = /b/g;
//re.exec(str6);
//console.debug(RegExp.input);
//console.debug(RegExp.leftContext);
//console.debug(RegExp.rightContext);
//console.debug(RegExp.lastMatch);
//console.debug(RegExp.lastParen);


//------------------------------------------------------
//圣诞专题
//var arr = 'chimney1,chimney,cmboy,cmgift,cmrun,cmtext1,cmtext,cmtree1,cmtree,sdman,snonman,wreath';
//var array = arr.split(',');
//var html = '';
//for(var i=0;i<array.length;i++){
//    html += '<li><a href="material/christmas/'+array[i]+'.swf" class="pic"><img src="material/christmas/'+array[i]+'-thumb.jpg" width="82" height="82" /></a><a href="material/christmas/'+array[i]+'.swf" class="btnPreview"></a></li>';
//    //console.debug(array[i]);
//}
//console.debug(html);

//爱情专题
//var arr = 'centipeda,heart,iou,pigeon,twoBear1,twoBear';
//var array = arr.split(',');
//var html = '';
//for(var i=0;i<array.length;i++){
//    html += '<li><a href="material/love/'+array[i]+'.swf" class="pic"><img src="material/love/'+array[i]+'-thumb.jpg" width="82" height="82" /></a><a href="material/love/'+array[i]+'.swf" class="btnPreview"></a></li>';
//    //console.debug(array[i]);
//}
//console.debug(html);

//动漫专题
//var arr = 'birds,frog,luguo,monkey2,monkey3,monkey4,monkey5,monkey6,monkey,panda,supeman,vagabond';
//var type = 'Dongman';
//var array = arr.split(',');
//var html = '';
//for(var i=0;i<array.length;i++){
//    html += '<li><a href="material/'+type+'/'+array[i]+'.swf" class="pic"><img src="material/'+type+'/'+array[i]+'-thumb.jpg" width="82" height="82" /></a><a href="material/'+type+'/'+array[i]+'.swf" class="btnPreview"></a></li>';
//    //console.debug(array[i]);
//}
//console.debug(html);

//搞笑专题
//var arr = 'crow,furong,mouse,neiyi,pig,tangseng';
//var type = 'funny';
//var array = arr.split(',');
//var html = '';
//for(var i=0;i<array.length;i++){
//    html += '<li><a href="material/'+type+'/'+array[i]+'.swf" class="pic"><img src="material/'+type+'/'+array[i]+'-thumb.jpg" width="82" height="82" /></a><a href="material/'+type+'/'+array[i]+'.swf" class="btnPreview"></a></li>';
//    //console.debug(array[i]);
//}
//console.debug(html);

//新年专题
//var arr = 'newYear,newYear1,fires,wish,firecracker,firecracker2,god,couplet,fu,lantern,couplet1,fu1,tiger,tiger1,lamp,wsry,girl';
//var type = 'newYear';
//var array = arr.split(',');
//var html = '';
//for(var i=0;i<array.length;i++){
//    html += '<li><a href="material/'+type+'/'+array[i]+'.swf" class="pic"><img src="material/'+type+'/'+array[i]+'-thumb.jpg" width="82" height="82" /></a><a href="material/'+type+'/'+array[i]+'.swf" class="btnPreview"></a></li>';
//    //console.debug(array[i]);
//}
//console.debug(html);

//情人节专题
var arr = '1,2,3,4,5,6,7,8,9,10';
var type = 'qing';
var array = arr.split(',');
var html = '';
for(var i=0;i<array.length;i++){
    html += '<li><a href="material/'+type+'/'+array[i]+'.swf" class="pic"><img src="material/'+type+'/'+array[i]+'-thumb.jpg" width="82" height="82" /></a><a href="material/'+type+'/'+array[i]+'.swf" class="btnPreview"></a></li>';
    //console.debug(array[i]);
}
console.debug(html);

//var bank = '工商银行,农业银行,招商银行,建设银行,交通银行,民生银行,深圳发展银行,中信银行,兴业银行,浦发银行,光大银行,北京银行,渤海银行,广东发展银行,广州市农信社,中国银行,邮政储蓄,广州市商业银行,上海农商银行,顺德农信社,华夏银行,南京银行';
//var arr = bank.split(',');
//var html = '';
//for(var i=1;i<arr.length+1;i++){
//    html += '<li><input name="bankCard" id="bcard'+i+'" type="radio" /><label for="bcard'+i+'">'+arr[i-1]+'</label></li>';
//}
//console.debug(html);
//------------------------------------------------------






