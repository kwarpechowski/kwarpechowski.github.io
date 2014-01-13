var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var N = 2,
    size = 500,
    v1 = [],
    v2 = [],
    objects = [],
    show = false,
    line = false,
    x1,x2,y1,y2,t,n,u,l;

function randomFromInterval(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}

function color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ )
        color += letters[Math.round(Math.random() * 15)];
    return color;
}

function randomPos (p) {
    return randomFromInterval(p, size-p);
}

function init() {
    for(var i = 0; i<N; i++) {
        var p = randomFromInterval(10, 40);
        objects[i] = {
           x: randomPos(p),
           y: randomPos(p),
           c: color(),
           hist: [],
           pr: p
        };
    }
}

function add() {
    N+=1;
    var p = randomFromInterval(10, 40);
    objects.push({
       x: randomPos(p),
       y: randomPos(p),
       c: color(),
       hist: [],
       pr: p,
       cx: randomFromInterval(-10, 10),
       cy: randomFromInterval(-10, 10),
    });
}

function showVector(i) {
    var o = objects[i];
    ctx.beginPath();
    ctx.moveTo(o.x,o.y);
    ctx.lineTo(o.x+o.cx*3,o.y+o.cy*3);
    ctx.lineWidth = 5;
    ctx.sorkeStyle = o.c;
    ctx.stroke();
}

function showLine(i) {
    var h = objects[i].hist;
    var length = h.length;
    if(length > 1) {
        ctx.beginPath();
        ctx.moveTo(h[0].x,h[0].y);
        for (var j=1; j<length; j++) ctx.lineTo(h[j].x, h[j].y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = objects[i].c
        ctx.stroke();
    }
}

function showCircle(i) {
    var o = objects[i];
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.pr, 0, 2 * Math.PI, false);
    ctx.fillStyle = o.c;
    ctx.fill();
}

function display() {
    for(var i = 0; i<N; i++) {
        showCircle(i);
        if(line) showLine(i);
        if(show) showVector(i);
    }
}

function randomSpeed() {
    for(var i = 0; i<N; i++) {
        objects[i].cx = randomFromInterval(-10, 10);
        objects[i].cy = randomFromInterval(-10, 10);
    }
}

function rm() {
    if(N>0) {
        objects.pop();
        N-=1;
    }
}

function run () {
    for (var i=0; i < N; i++){
        var oi = objects[i];
        
        oi.x += oi.cx;
        oi.y += oi.cy;
        if (oi.y+oi.pr < size)
            oi.cy = oi.cy + Math.sqrt(2*9.81*oi.y);

        if(line) oi.hist.push({x: oi.x, y: oi.y});

        if(oi.x <= oi.pr) {
            oi.cx*=-1;
        }

        if(oi.x >= size-oi.pr) {
            oi.cx*=-1;
        }

        if(oi.y <= oi.pr) {
            oi.cy*=-1;
        }

        if(oi.y >= size-oi.pr) {
            oi.cy*=-1;
        }
        
        for(var j=0; j<N; ++j) {
            var oj = objects[j];
            if(i != j) {

                x1 = oi.x;
                x2 = oj.x;

                y1 = oi.y;
                y2 = oj.y;

                l =Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));

                if(l <= oi.pr+oj.pr) {

                    v1.x = oi.cx;
                    v1.y = oi.cy;
                    v2.x = oj.cx;
                    v2.y = oj.cy

                    u = {
                        1: oi.pr/(oi.pr+oj.pr),
                        2: oj.pr/(oi.pr+oj.pr)
                    };

                    n = {
                        x: (x2-x1)/l,
                        y: (y2-y1)/l
                    };

                    t = {
                        x: (-1*(y2-y1))/l,
                        y: (x2-x1)/l
                    };

                    v1 = {
                        n: (v1.x*(x2-x1) + v1.y*(y2-y1))/l,
                        t: (-1*v1.x*(y2-y1) + v1.y*(x2-x1))/l,
                    };

                    v2 = {
                        n: (v2.x*(x2-x1) + v2.y*(y2-y1))/l,
                        t: (-1*v2.x*(y2-y1) + v2.y*(x2-x1))/l
                    }

                    v1.nP =  (u[1]-u[2])*v1.n + 2*u[2]*v2.n;
                    v2.nP =  -1*(u[1]-u[2])*v2.n + 2*u[1]*v1.n;

                    oi.cx = v1.nP*n.x + v1.t*t.x;
                    oi.cy = v1.nP*n.y + v1.t*t.y;

                    oj.cx = v2.nP*n.x + v2.t*t.x;
                    oj.cy = v2.nP*n.y + v2.t*t.y;

                }
            }
        }
    }
}

function interval(value) {
    var p  = parseInt(value);
    if(!isNaN(p)) {
        clearInterval(t);
        t = setInterval(function(){
            step();
        }, p);
    }
}

function step() {
    run();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    display();
}

function wektory () {
    if(show) show = false;
    else show = true;
}

function showLineBtn () {
    if(line) {
        line = false;
        for(var i = 0; i<N; i++) {
            objects[i].hist = [];
        }
    }else line = true;
}

init();
randomSpeed();

var t = setInterval(function(){
    step();
},200);
