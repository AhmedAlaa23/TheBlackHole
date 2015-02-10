function blackhole(ctx){
	this.x=ctx.canvas.width/2;
	this.y=ctx.canvas.height/2;
	this.r= ctx.canvas.width/60;
	this.mass=100000;
	this.vx=0;
	this.vy=0;
	
	this.render = function(ctx){
		ctx.beginPath();
		ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, this.r, 0, 6.2831);
		ctx.fillStyle = "black";
		ctx.fill();
	}
}


function circle(){
	this.x=300;
	this.y=300;
	this.r= cw/120;
	this.mass=1000;
	this.vx=0;				// velocity in the x axis
	this.vy=5;				// velocity in the y axis and the initial velocity is 5 in the Y axis
	this.color = "blue";
	this.massscore=100;
	
	this.render = function(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 6.2831);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

// canvas width and height as global variables to acces them anywhere
var cw=0;
var ch=0;

function init(){
	var ctx = document.getElementById("spacecanvas").getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height  = window.innerHeight;
	cw = ctx.canvas.width;
	ch = ctx.canvas.height;
	
	var circs = []; // the array that has the objects
	var i=0;	// the index that incerement whenever an object is created when the mouse is clicked
	var p = -1; // pause when 1
	var gover=0; // game over when = 1
	var score=0;
	var trace = 1; 	// 1 for shawing the trace behind the object
	var showscore = document.getElementById("scorenumber");
	
	var r= cw/120;		// initial values that change later when choosing moon or sun
	var mass=1000;
	var color="blue";
	var massscore=100;
	
	var hole = new blackhole(ctx);	// init the balckhole
	
	circs[i] = new circle();		// init the first object
	circs[i].x = (cw/2.7);
	circs[i].y = (ch/2.7);
	i++;
	
	function animate(){
		if(trace == -1){						// remove the trace
			ctx.clearRect(0,0,cw,ch);
		}
		else{
			ctx.fillStyle= "rgba(255,255,255, 0.1)";
			ctx.fillRect(0,0,cw,ch);
		}
		
		hole.render(ctx);			// render the black hole
		
		for(i=0; i<circs.length; i++){  // calc the x,v of every object in the array of objects
			circs[i].render(ctx);
			
			circs[i].x += circs[i].vx;
			circs[i].y += circs[i].vy;
			
			calcv(i); // calculate Velocity and the score and detect if any two objects hit each others
		}
		
		showscore.innerHTML = Math.floor(score);
		
		if(p != 1 && gover != 1){
			window.requestAnimationFrame(animate);
			//animrate =  setInterval(animate, 1000);
		}
	}
	animate();
	
	
	function calcv(object){		// calculate ths velocity and detect gameover and calc the score
		// the radius between the selected object and the others cilcles (a^2 = b^2 + c^2)
		var hrad = Math.sqrt(Math.pow(Math.abs(hole.y-circs[object].y),2) + Math.pow(Math.abs(hole.x-circs[object].x),2));
		
		//circs[object].vy += ( ( ( (hole.y-circs[object].y) * hole.mass) /(hrad) ) + ((circs[object].mass*Math.pow(circs[object].vy,2))/hrad) )/1000000;
		//circs[object].vx += ( ( ( (hole.x-circs[object].x) * hole.mass) /(hrad) ) + ((circs[object].mass*Math.pow(circs[object].vx,2))/hrad) )/1000000;
		// 1000000
		var vspeed = 1000000;
		circs[object].vy += ( ( (hole.y-circs[object].y) * (hole.mass + circs[object].mass) ) / (hrad+circs[object].mass/100) )  /vspeed;	// add velocity
	
		circs[object].vx += ( ( (hole.x-circs[object].x) * (hole.mass + circs[object].mass) ) / (hrad+circs[object].mass/100) ) /vspeed;
		
		
		// check if an object hit the black hole
		if(hrad <= hole.r){
			gover=1;
			document.getElementById("state").style.display = "inline-block";
			document.getElementById("state").innerHTML = "Game Over <br>The Black Hole Swallowed an Object :(<br><span id='scorespan'>Your Score is: "+Math.floor(score)+"</span>";
			document.getElementById("ng").style.display = "inline-block";
		}
		
		if(circs.length>1){		// start adding score when the user add an object
			score += (circs[object].massscore / hrad); // Adding the score
		}
		
		for(k=0; k<circs.length; k++){	// calc the velocity for every object with the ohter objects
			if(object != k){
				var orad = Math.sqrt(Math.pow(Math.abs(circs[k].y-circs[object].y),2) + Math.pow(Math.abs(circs[k].x-circs[object].x),2));
				
				if(orad <= circs[k].r){ 	// check if two objects hit each others
					gover=1;
					document.getElementById("state").style.display = "inline-block";
					document.getElementById("state").innerHTML = "Game Over <br>Two Objects has hit each other :(<br><span id='scorespan'>Your Score is: "+Math.floor(score)+"</span>";
					document.getElementById("ng").style.display = "inline-block";
				}
				
				// v,x velocity = gravitational force + centripetal force = ((y-y) * mass)/r^2 + (mass*velocity^2)/r^2
				//circs[object].vy += ( ( ( (circs[k].y-circs[object].y) * circs[k].mass ) /orad ) + ((circs[object].mass*Math.pow(circs[object].vy,2))/orad) )/1000000;
				//circs[object].vx += ( ( ( (circs[k].x-circs[object].x) * circs[k].mass ) /orad ) + ((circs[object].mass*Math.pow(circs[object].vx,2))/orad) )/1000000;
			
				circs[object].vy += ( ( (circs[k].y-circs[object].y) * (circs[k].mass + circs[object].mass ) ) / (orad+circs[object].mass/100) )  /1000000;
	
				circs[object].vx += ( ( (circs[k].x-circs[object].x) * (circs[k].mass + circs[object].mass ) ) / (orad+circs[object].mass/100) ) /1000000;
				
			}
		}
		
	}
	
	
	
	ctx.canvas.addEventListener("click", function(event){		// when mouse clicked on the canvas it create a new object
		var mousex = event.clientX - ctx.canvas.offsetLeft;	// to get the coordinates inside the canvas right if there is a space left in the page
		var mousey = event.clientY - ctx.canvas.offsetTop;
		
		circs[i] = new circle();		// creating an object in the array with it's values
		circs[i].x = mousex;
		circs[i].y = mousey;
		circs[i].r = r;
		circs[i].mass = mass;
		circs[i].color = color;
		circs[i].massscore = massscore;
		i++;
	});
	
	
	document.getElementById("pause").addEventListener("click", function(){	// to pause the game
		//clearInterval(animrate);
		p *= -1;
		
		if(p==1){
			document.getElementById("pause").innerHTML = "Continue";
		}
		else if(p==-1){
			document.getElementById("pause").innerHTML = "Pause";
			if(gover!=1){
				animate();
			}
		}
	});
	
	document.getElementById("sun").addEventListener("click", function(){
		r= cw/80;		// setting the values of the sun that will be set to it when created
		mass=10000;
		color="orange";
		massscore=500;
		document.getElementById("sun").style.color = "brown";
		document.getElementById("planet").style.color = "black";
		document.getElementById("moon").style.color = "black";
	});
	
	document.getElementById("planet").addEventListener("click", function(){
		r= cw/120;
		mass=1000;
		color="blue";
		massscore=100;
		document.getElementById("sun").style.color = "black";
		document.getElementById("planet").style.color = "brown";
		document.getElementById("moon").style.color = "black";
	});
	
	document.getElementById("moon").addEventListener("click", function(){
		r= cw/200;
		mass=100;
		color="gray";
		massscore=10;
		document.getElementById("sun").style.color = "black";
		document.getElementById("planet").style.color = "black";
		document.getElementById("moon").style.color = "brown";
	});
	
	document.getElementById("trace").addEventListener("click", function(){		// show or hide the trace
		trace *= -1;
		
		if(trace==1){
			document.getElementById("trace").innerHTML = "Hide Trace";
		}
		else if(trace==-1){
			document.getElementById("trace").innerHTML = "Show Trace";
		}
	});
	
	document.getElementById("showinst").addEventListener("click", function(){		// show instructions
		document.getElementById("inst").style.display = "block";
		console.log("here");
	});
	
	document.getElementById("closeinst").addEventListener("click", function(){		// show instructions
		document.getElementById("inst").style.display = "none";
		console.log("here");
	});
	
	document.getElementById("ng").addEventListener("click", function(){		// New Game
		location.reload();
	});
	
}


window.addEventListener("load", function(event){
	init();
});

/*
some old code !
var trad = Math.sqrt(Math.pow(Math.abs(hole.y-circs[i].y),2) + Math.pow(Math.abs(hole.x-circs[i].x),2));
circs[i].vy += ( ((hole.y-circs[i].y) * hole.mass /trad) + ((circs[i].mass*Math.pow(circs[i].vy,2))/trad) )/1000000;
circs[i].vx += ( ((hole.x-circs[i].x) * hole.mass /trad) + ((circs[i].mass*Math.pow(circs[i].vx,2))/trad) )/1000000;

clearInterval(animateInterval);
*/