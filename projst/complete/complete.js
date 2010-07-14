
function bug(o){
    console.debug(o);
}
function delayedInput(opt){
    opt.time    = opt.time || 400;
    opt.chars   = opt.chars !== null ? opt.chars : 3;
    opt.open    = opt.open || function(){};
    opt.close   = opt.close || function(){};
    opt.focus   = opt.focus !== null ? opt.focus : false;

    var old = opt.elem.value;
    var open = false;
    setInterval(function(){
        var newValue = opt.elem.value;
        var v = newValue.length;
        if(old != newValue){
            if(v < opt.chars && open){
                opt.close();
                open = false;
            }else if(v >= opt.chars && v>0){
                opt.open(newValue, open);
                open = true;
            }
            old = newValue;
        }
    }, opt.time);
    opt.elem.onkeyup = function(){
        if(this.value.length < opt.chars && open){
            opt.close();
            open = false;
        }
    };
    if(opt.focus){
        opt.elem.onblur = function(){
            if(open){
                opt.close();
                open = false;
            }
        };
        opt.elem.onfocus = function(){
            if(this.value.length !== 0 && !open){
                opt.open('', open);
                open = true;
            }
        };
    }
}

delayedInput({
    elem : id('key'),
    chars : 3,
    focus : true,
    open : function(q,open){
        var w = trim(q.substr(q.lastIndexOf(',')+1, q.length));
        if(w){
            show(id('loading'));
            //TODO 搜索结果
            hide(id('loading'));
            show(id('results'));
        }else{
            show(id('results'));
        }
    },
    close : function(){
        hide(id('results'));
    }
});

