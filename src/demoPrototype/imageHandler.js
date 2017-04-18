//Create the Canvas
var canvas = createCanvas(640, 480, "solid 2px green", true);
//Get Canvas Context
var ctx = canvas.getContext("2d");


//Create the load image button.
var button = document.createElement("button");
button.innerHTML = "Load Image";
//Make button disabled at first.
button.disabled = true;
button.addEventListener('click',function(){
	//Make variable img represent the source image
	var img = document.getElementById("img");
	//Set the canvas the size of the img
	canvas.width = img.width;
	canvas.height = img.height;
	//Draw the Image
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}, false);
document.body.appendChild(button);

//Enable button when image loads.
document.getElementById("img").addEventListener('load', function(){ 
	button.disabled = false;
}, false);



var grayscale = [];

//Create the load image button.
var button2 = document.createElement("button");
button2.innerHTML = "Grayscale";
button2.addEventListener('click',function(){
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	for (var i = 0; i < imgData.data.length; i += 4){
		var pos = i/4;
		var y = Math.floor(pos/canvas.width);
		var x = pos - y*canvas.width;
		grayscale[pos] = 0.299*imgData.data[i] + 0.587*imgData.data[i+1] + 0.114*imgData.data[i+2];
		imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = grayscale[pos];
	}
	ctx.putImageData(imgData, 0, 0);
}, false);
document.body.appendChild(button2);


var sobelX = [];
var sobelY = [];

//Create the load image button.
var button3 = document.createElement("button");
button3.innerHTML = "Sobel";
button3.addEventListener('click',function(){
	for (var y = 1; y < canvas.height - 1; y++){
		for (var x = 1; x < canvas.width - 1; x++){
			
			sobelX[xyToPos(x,y)] = 0;
			sobelX[xyToPos(x,y)] += -1*grayscale[xyToPos(x-1,y-1)];
			sobelX[xyToPos(x,y)] += -2*grayscale[xyToPos(x-1,y)];
			sobelX[xyToPos(x,y)] += -1*grayscale[xyToPos(x-1,y+1)];
			sobelX[xyToPos(x,y)] += 1*grayscale[xyToPos(x+1,y-1)];
			sobelX[xyToPos(x,y)] += 2*grayscale[xyToPos(x+1,y)];
			sobelX[xyToPos(x,y)] += 1*grayscale[xyToPos(x+1,y+1)];
			
			sobelY[xyToPos(x,y)] = 0;
			sobelY[xyToPos(x,y)] += -1*grayscale[xyToPos(x-1,y-1)];
			sobelY[xyToPos(x,y)] += -2*grayscale[xyToPos(x,y-1)];
			sobelY[xyToPos(x,y)] += -1*grayscale[xyToPos(x+1,y-1)];
			sobelY[xyToPos(x,y)] += 1*grayscale[xyToPos(x-1,y+1)];
			sobelY[xyToPos(x,y)] += 2*grayscale[xyToPos(x,y+1)];
			sobelY[xyToPos(x,y)] += 1*grayscale[xyToPos(x+1,y+1)];
		}
	}
	drawSobel();
}, false);
document.body.appendChild(button3);

function xyToPos(x, y){
	return y*canvas.width + x;
}
function drawSobel(){
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	for (var i = 0; i < imgData.data.length; i += 4){
		var pos = i/4;
		
		//Inspired by YUV color model to represent angle.
		//X = V
		//Y = U
		imgData.data[i] = Math.abs(1.13983*sobelX[pos]);
		imgData.data[i+2] = Math.abs(2.03211*sobelY[pos]);
		imgData.data[i+1] = Math.abs(-0.39465*sobelY[pos] + -0.58060*sobelX[pos]);
		//imgData.data[i] = 1.13983*(sobelX[pos]+1020)/2040 * 255;
		//imgData.data[i+2] = 2.03211*(sobelY[pos]+1020)/2040 * 255;
		//imgData.data[i+1] = -0.39465*(sobelY[pos]+1020)/2040 + -0.58060*(sobelX[pos]+1020)/2040 * 255;
		
		imgData.data[i+3] = 255;
	}
	ctx.putImageData(imgData, 0, 0);
}
//Draw the region around the ball, effectively erasing the last frame with the ball.
function drawRegion(ball){
	ctx.drawImage(document.getElementById("img"), ball.x-ball.radius*2, ball.y-ball.radius*2, ball.radius*6, ball.radius*6, ball.x-ball.radius*2, ball.y-ball.radius*2, ball.radius*6, ball.radius*6);
}

var interval;

//Create the load image button.
var button4 = document.createElement("button");
button4.innerHTML = "Animate";
button4.addEventListener('click',function(){
	//interval = setInterval(draw, 100);
	//Draw the Image as background
	ctx.drawImage(document.getElementById("img"), 0, 0, canvas.width, canvas.height);
	window.requestAnimationFrame(draw);
}, false);
document.body.appendChild(button4);

var button5 = document.createElement("button");
button5.innerHTML = "Stop";
button5.addEventListener('click',function(){
	clearInterval(interval);
}, false);
document.body.appendChild(button5);


var ball = new Ball();
var dropIt = true;
canvas.addEventListener("mousemove",function(e){
	var canvasRect = canvas.getBoundingClientRect();
	if (!dropIt){
		ball.velX = 0;
		ball.velY = 0;
		ball.x = e.clientX - canvasRect.left - ball.radius;
		ball.y = e.clientY - canvasRect.top - ball.radius;
		draw();
	}else{
		//ball.velX = -(ball.x - (e.clientX - canvasRect.left));
		//ball.velY = -(ball.y - (e.clientY - canvasRect.top));
	}
});
canvas.addEventListener("click",function(e){
	dropIt = !dropIt;
	draw();
});

function draw(){
	//drawSobel();
	drawRegion(ball);
	ball.draw();
	ball.update();
	//console.log("Hello Draw");
	//setTimeout(function(){window.requestAnimationFrame(draw);},30);
	if (dropIt){
		setTimeout(function(){window.requestAnimationFrame(draw);},15);//30);
		//window.requestAnimationFrame(draw);
	}else{
		//clearInterval(interval);
	}
}



function Ball(){
	this.x = 50;
	this.y = 50;
	this.radius = 10;
	
	this.velX = 0;
	this.velY = 0;
	this.terminalVel = 10;//10;//7;//10;
	
	this.accelY = 1;
	this.accelX = 0;//1;
	
	this.damp = 0.75;
	
	this.collisionList = [];
	this.collisionThreshold = 50;
	
	//Create collision mask
	var canv = createCanvas(this.radius*2, this.radius*2, "", false);
	var ctx2 = canv.getContext("2d");
	ctx2.strokeStyle = "yellow";
	ctx2.fillStyle = "orange";
	ctx2.beginPath();
	ctx2.arc(this.radius, this.radius, this.radius, 0, 2*Math.PI);
	ctx2.stroke();
	ctx2.fill();
	var imageData = ctx2.getImageData(0, 0, canv.width, canv.height);
	
	for (var i = 0; i < imageData.data.length; i+=4){
		if (imageData.data[i+3] > 254){
			var pos = i/4;
			var xv = pos%canv.width;
			var yv = ((pos - xv)/canv.width)
			
			if ((xv % 2 == 0 && yv % 2 != 0) || (xv % 2 != 0 && yv % 2 == 0)){//Get every other pixel
				imageData.data[i+2] =imageData.data[i+1] = imageData.data[i] = 255 - imageData.data[i+3];
				imageData.data[i+3] = 255;
				this.collisionList.push({x:xv, y:yv});//Half list
			}
			//this.collisionList.push({x:xv, y:yv});//Full list
			
		}else{
			imageData.data[i+3] = 0;
		}
	}
	//One second later draw the collision list
	setTimeout(function(){ctx2.putImageData(imageData, 0, 0);}, 1000);
	
	//Draw the object on the canvas.
	this.draw = function(){
		
		ctx.strokeStyle = "yellow";
		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
	}
	
	this.collisionCount = 0;
	this.edgeXSum = 0;
	this.edgeYSum = 0;
		
	this.update = function(){
		
		//collision detection				
		if (this.testCollision(true) > 0){
		
			this.findFirstCollision();
						
			var edgeY = this.edgeYSum/this.collisionCount;
			var edgeX = this.edgeXSum/this.collisionCount;
			
			var ballAngle = Math.atan2(this.velY, this.velX);
			var ballSpeed = Math.sqrt(this.velY*this.velY + this.velX*this.velX);
			
			var normal = Math.atan2(edgeY,edgeX);
			var ballReflectAngle = 2*normal - ballAngle;
			
			this.velY = -Math.floor(Math.sin(ballReflectAngle)*ballSpeed*this.damp);
			this.velX = -Math.floor(Math.cos(ballReflectAngle)*ballSpeed*this.damp);
			
		}
				
		//Prevent the ball from going faster than the terminal velocity
		if (this.velY > this.terminalVel){this.velY = this.terminalVel;}
		if (this.velY < -this.terminalVel){this.velY = -this.terminalVel;}
		if (this.velX > this.terminalVel){this.velX = this.terminalVel;}
		if (this.velX < -this.terminalVel){this.velX = -this.terminalVel;}
				
		//Update Position and velocity
		this.x += this.velX;
		this.y += this.velY;
		this.velY += this.accelY;
		this.velX += this.accelX;
		
		//Prevent the ball from going outside the top and bottom of the canvas.
		if (this.y < 0 || this.y + this.radius*2 > canvas.height){
			this.velY *= -1;
			if (this.y < 0){
				this.y = 0;
			}else{
				this.y = canvas.height - this.radius*2;
			}
		}
		//Prevent the ball from going outside the left and right of the canvas.
		if (this.x < 0 || this.x + this.radius*2 > canvas.width){
			this.velX *= -1;
			if (this.x < 0){
				this.x = 0;
			}else{
				this.x = canvas.width - this.radius*2;
			}
		}
	}
	//Test to see if there is a collision.
	//Passing true to this function will draw the collision pixels in green.
	this.testCollision = function(showCollision){
		this.collisionCount = 0;
		this.edgeXSum = 0;
		this.edgeYSum = 0;
		for (var i = 0; i < this.collisionList.length; i++){
			var pos = xyToPos(Math.floor(this.x) + this.collisionList[i].x, Math.floor(this.y) + this.collisionList[i].y);

			if (sobelX[pos] > this.collisionThreshold || 
				sobelX[pos] < -this.collisionThreshold||
				sobelY[pos] > this.collisionThreshold ||
				sobelY[pos] < -this.collisionThreshold){
			
				this.collisionCount++;
				this.edgeXSum += sobelX[pos];
				this.edgeYSum += sobelY[pos];
				
				if (showCollision === true){//Draw the collisions as green pixels
					var tmpImgData = ctx.createImageData(1,1);
					tmpImgData.data[0] = tmpImgData.data[2] = 0
					tmpImgData.data[1] = tmpImgData.data[3] = 255;
					ctx.putImageData(tmpImgData, Math.floor(this.x) + this.collisionList[i].x, Math.floor(this.y) + this.collisionList[i].y);
				}
			}
		}
		return this.collisionCount;
	}
	//Reset the ball, and slowly move it forward testing for the first collision point.
	this.findFirstCollision = function(){
		var futureX = this.x;
		var futureY = this.y;
		this.x -= this.velX;
		this.y -= this.velY;
		
		var dx = 0;
		var dy = 0;
		
		var velLen = Math.sqrt(this.velY*this.velY + this.velX*this.velX);
				
		if (velLen != 0){
			if (velLen == Math.abs(this.velX)){//No Y component
				dx = this.velX/Math.abs(this.velX);
				while (this.testCollision() == 0 && this.x != futureX){
					this.x += dx;
					//this.draw();
				}
			}else if (velLen == Math.abs(this.velY)){//No X component
				dy = this.velY/Math.abs(this.velY);
				while (this.testCollision() == 0 && this.y != futureY){
					this.y += dy;
					//this.draw();
				}
			}else{//Diagonal
				if (Math.abs(this.velY) > Math.abs(this.velX)){
					dx = this.velX / Math.abs(this.velY);
					dy = this.velY/Math.abs(this.velY);
				}else{
					dy = this.velY / Math.abs(this.velX);
					dx = this.velX/Math.abs(this.velX);	
				}
				while (this.testCollision() == 0 && this.y != futureY){
					this.x += dx;
					this.y += dy;
					//this.draw();
				}
			}
			//New position of x,y is the first collision location.
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			//console.log("Got first collision?");
			if (this.collisionCount == 0){
				this.collisionCount = 1;
			}
		}
	}
}
//Create a canvas to draw on.
function createCanvas(w, h, border, appendToDoc){
	var canvas = document.createElement("canvas");
	canvas.style.border = border;
	canvas.width = w;
	canvas.height = h;
	if (appendToDoc){
		document.body.appendChild(canvas);
	}
	return canvas;
}
