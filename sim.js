var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var N = 2;
var size = 500;
var x = new Array();
var y = new Array();
var cx = new Array();
var cy = new Array();
var c = new Array();
var pr = new Array();
var hist = new Array();
var show = false;
var line = false;
var x1,x2,y1,y2, t, n, u, l;
var v1 = {};
var v2 = {};

function color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ )
    	color += letters[Math.round(Math.random() * 15)];
    return color;
}

function init() {
	for(var i = 0; i<N; i++) {
		x[i] = Math.floor((Math.random()*380)+10);
		y[i] = Math.floor((Math.random()*380)+10);
		pr[i] = Math.floor((Math.random()*30)+10);
		hist[i] = new Array();
		c[i] = color();
	}
}

function display() {
	for(var i = 0; i<N; i++) {

		ctx.beginPath();
		ctx.arc(x[i], y[i], pr[i], 0, 2 * Math.PI, false);
		ctx.fillStyle = c[i];
		ctx.fill();
	

		if(line) {
			var length = hist[i].length;
			var h = hist[i];

			if(length > 1) {
				ctx.beginPath();
				ctx.moveTo(h[0].x,h[0].y);
				for (var j=1; j<length; j++) {
					ctx.lineTo(h[j].x, h[j].y);
				}
				ctx.lineWidth = 1;
				ctx.strokeStyle = c[i];
		    	ctx.stroke();
			}
		}

		if(show) {
			ctx.beginPath();
		    ctx.moveTo(x[i],y[i]);
		    ctx.lineTo(x[i]+cx[i]*3,y[i]+cy[i]*3);
		    ctx.lineWidth = 5;
		    ctx.sorkeStyle = c[i];
	    	ctx.stroke();
		}
	}
}

function roundSpeed() {
	for(var i = 0; i<N; i++) {
		cx[i] = 0;
		cy[i] = 10;
	}
}

function add() {
	N+=1;
	cx.push(0);
	cy.push(10);
	x.push(Math.floor((Math.random()*380)+10));
	y.push(Math.floor((Math.random()*380)+10));
	pr.push(Math.floor((Math.random()*30)+10));
	hist.push(new Array());
	c.push(color());
}

function rm() {
	if(N>0) {
		cx.pop();
		cy.pop();
		x.pop();
		y.pop()
		c.pop();
		pr.pop();
		hist.pop();
		N-=1;
	}
}

function run () {
	for (var i=0; i < N; i++){


			x[i] += cx[i];
			y[i] += cy[i];

			if(line) hist[i].push({x: x[i], y:y[i]});

			if(x[i] <= pr[i]) {
				cx[i]*=-1;
			}

			if(x[i] >= size-pr[i]) {
				cx[i]*=-1;
			}

			if(y[i] <= pr[i]) {
				cy[i]*=-1;
			}

			if(y[i] >= size-pr[i]) {
				cy[i]*=-1;
			}
			
			for(var j=0; j<N; ++j) {
				if(x[j] != -1 && y[j] != -1 && i != j) {

					x1 = x[i];
					x2 = x[j];

					y1 = y[i];
					y2 = y[j];

					l =Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));

					if(l <= pr[i]+pr[j]) {

						v1.x = cx[i];
						v1.y = cy[i];
						v2.x = cx[j];
						v2.y = cy[j];
						v2 = {
							x: cx[j],
							y: cy[j]
						};

						u = {
							1: pr[i]/(pr[i]+pr[j]),
							2: pr[j]/(pr[i]+pr[j])
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



						cx[i] = v1.nP*n.x + v1.t*t.x;
						cy[i] = v1.nP*n.y + v1.t*t.y;

						cx[j] = v2.nP*n.x + v2.t*t.x;
						cy[j] = v2.nP*n.y + v2.t*t.y;

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

function showLine () {
	if(line) {
		line = false;
		for(var i = 0; i<N; i++) {
			hist[i] = new Array();
		}
	}else line = true;
}

init();
roundSpeed();

var t = setInterval(function(){
	step();
},200);