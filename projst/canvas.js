window.onload = function(){
    clock();
    setInterval(clock,1000);
};

function clock(){
    var now = new Date();
    var sec = now.getSeconds();
    var min = now.getMinutes();
    var hr = now.getHours();
    
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.save();
    ctx.clearRect(0,0,150,150);
    ctx.translate(75,75);
    ctx.scale(0.4,0.4);
    ctx.rotate(-Math.PI/2);
    ctx.strokeStyle = 'block';
    ctx.fillStyle = 'block';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    //小时刻度
    ctx.save();
    ctx.beginPath();
    for (var i = 0; i < 12; i++) {
        ctx.rotate(Math.PI/6);
        ctx.moveTo(100,0);
        ctx.lineTo(120,0);
    }
    ctx.stroke();
    ctx.restore();
    
    //分钟刻度
    ctx.save();
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (var j = 0; j < 60; j++) {
        if (j%5 !== 0) {
            ctx.moveTo(117,0);
            ctx.lineTo(120,0);
        }
        ctx.rotate(Math.PI/30);
    }
    ctx.stroke();
    ctx.restore();

    //时针
    ctx.save();
    ctx.rotate((Math.PI/6)*hr + (Math.PI/360)*min + (Math.PI/21600)*sec);
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-20,0);
    ctx.lineTo(80,0);
    ctx.stroke();
    ctx.restore();

    //分针
    ctx.save();
    ctx.rotate((Math.PI/30)*min + (Math.PI/1800)*sec);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-28,0);
    ctx.lineTo(112,0);
    ctx.stroke();
    ctx.restore();

    //秒针
    ctx.save();
    ctx.rotate((Math.PI/30)*sec);
    ctx.strokeStyle = '#D40000';
    ctx.fillStyle = '#D40000';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-30,0);
    ctx.lineTo(83,0);
    ctx.stroke();
    ctx.restore();
    
    //蓝色圆圈
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#325FA2';
    ctx.beginPath();
    ctx.arc(0,0,142,0,Math.PI*2,true);
    ctx.stroke();
    ctx.restore();
    
    ctx.restore();

}
