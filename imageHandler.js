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
			//sobelX[xyToPos(x,y)] = Math.abs(sobelX[xyToPos(x,y)]);
			//sobelX[xyToPos(x,y)] += 255/2;
			//if (sobelX[xyToPos(x,y)] > 255 || sobelX[xyToPos(x,y)] < 0){
			//		console.log(sobelX[xyToPos(x,y)])
			//}
			
			sobelY[xyToPos(x,y)] = 0;
			sobelY[xyToPos(x,y)] += -1*grayscale[xyToPos(x-1,y-1)];
			sobelY[xyToPos(x,y)] += -2*grayscale[xyToPos(x,y-1)];
			sobelY[xyToPos(x,y)] += -1*grayscale[xyToPos(x+1,y-1)];
			sobelY[xyToPos(x,y)] += 1*grayscale[xyToPos(x-1,y+1)];
			sobelY[xyToPos(x,y)] += 2*grayscale[xyToPos(x,y+1)];
			sobelY[xyToPos(x,y)] += 1*grayscale[xyToPos(x+1,y+1)];
			//sobelY[xyToPos(x,y)] = Math.abs(sobelY[xyToPos(x,y)]);
			//sobelY[xyToPos(x,y)] += 255/2;
			//if (sobelY[xyToPos(x,y)] > 255 || sobelY[xyToPos(x,y)] < 0){
			//		console.log(sobelY[xyToPos(x,y)])
			//}
			
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
		//imgData.data[i] = sobelX[pos];
		//imgData.data[i+1] = sobelY[pos];
		//imgData.data[i+2] = 0;
		//X = V
		//Y = U
		//imgData.data[i] = /*grayscale[pos] +*/ 1.13983*sobelX[pos];
		//imgData.data[i+2] = /*grayscale[pos] +*/ 2.03211*sobelY[pos];
		//imgData.data[i+1] = /*grayscale[pos] +*/ -0.39465*sobelY[pos] + -0.58060*sobelX[pos];
		
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

function drawSobelRegion(ball){
	var imgData = ctx.createImageData(ball.radius*6, ball.radius*6);
	var tx, ty;
	var pos, i;
	for (var y = 0; y < ball.radius*6; y++){
		for (var x = 0; x < ball.radius*6; x++){
			tx = x + ball.x - ball.radius*2; 
			ty = y + ball.y - ball.radius*2;
			
			pos = xyToPos(tx, ty);
			i = (y*(ball.radius*6)+x)*4;
			imgData.data[i] = Math.abs(1.13983*sobelX[pos]);
			imgData.data[i+2] = Math.abs(2.03211*sobelY[pos]);
			imgData.data[i+1] = Math.abs(-0.39465*sobelY[pos] + -0.58060*sobelX[pos]);
			imgData.data[i+3] = 255;
		}
	}
	ctx.drawImage(document.getElementById("img"), ball.x-ball.radius*2, ball.y-ball.radius*2, ball.radius*6, ball.radius*6, ball.x-ball.radius*2, ball.y-ball.radius*2, ball.radius*6, ball.radius*6);
	//ctx.putImageData(imgData, ball.x-ball.radius*2, ball.y-ball.radius*2);
}

var interval;
//Create the load image button.
var button4 = document.createElement("button");
button4.innerHTML = "Animate";
button4.addEventListener('click',function(){
	//interval = setInterval(draw, 100);
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
var canvasRect = canvas.getBoundingClientRect();
var dropIt = true;
canvas.addEventListener("mousemove",function(e){
	if (!dropIt){
		ball.velX = 0;
		ball.velY = 0;
		ball.x = e.clientX - canvasRect.left;
		ball.y = e.clientY - canvasRect.top;
		draw();
	}
});
canvas.addEventListener("click",function(e){
	dropIt = !dropIt;
	draw();
});

function draw(){
	//drawSobel();
	drawSobelRegion(ball);
	ball.draw();
	ball.update();
	console.log("Hello Draw");
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
	this.terminalVel = 15;//10;//7;//10;
	
	this.accelY = 1;
	
	this.collisionList = [];
	this.collisionThreshold = 50;
	
	var canv = createCanvas(this.radius*2, this.radius*2, "", true);
	var ctx2 = canv.getContext("2d");
	ctx2.strokeStyle = "yellow";
	ctx2.fillStyle = "orange";
	ctx2.beginPath();
	ctx2.arc(this.radius, this.radius, this.radius, 0, 2*Math.PI);
	ctx2.stroke();
	ctx2.fill();
	var imageData = ctx2.getImageData(0, 0, canv.width, canv.height);
	
	for (var i = 0; i < imageData.data.length; i+=4){
		//console.log(imageData.data[i+0], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3]);
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
	setTimeout(function(){ctx2.putImageData(imageData, 0, 0);}, 1000);
	
	
	
	this.draw = function(){
		
		ctx.strokeStyle = "yellow";
		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.fillRect(this.x, this.y, 1, 1);
		
		
		//this.update();
		
		//window.requestAnimationFrame(draw);
	}
	this.ignoreNextCol = false;
	this.update = function(){
		
		
		var hold = false;
		//collision detection
		var pos;
		var collisionCount = 0;
		var edgeXSum = 0;
		var edgeYSum = 0;
		var dirCounts = [0,0,0,0];
		for (var i = 0; i < this.collisionList.length; i++){
			pos = xyToPos(this.x + this.collisionList[i].x, this.y + this.collisionList[i].y);

			/*
			if (sobelX[pos] > this.collisionThreshold || sobelX[pos] < -this.collisionThreshold){
				//console.log("x collision");
				hold = true;
			}
			if (sobelY[pos] > this.collisionThreshold || sobelY[pos] < -this.collisionThreshold){
				//console.log("y collision");
				hold = true;
			}*/
			if (sobelX[pos] > this.collisionThreshold){
				hold = true;
				dirCounts[0]++;
			}
			if (sobelX[pos] < -this.collisionThreshold){
				hold = true;
				dirCounts[1]++;
			}
			if (sobelY[pos] > this.collisionThreshold){
				hold = true;
				dirCounts[2]++;
			}
			if (sobelY[pos] < -this.collisionThreshold){
				hold = true;
				dirCounts[3]++;
			}
			
			
			if (hold){
				hold = false;
				collisionCount++;
				edgeXSum += sobelX[pos];
				edgeYSum += sobelY[pos];
				//console.log(this.x + this.collisionList[i].x, this.y + this.collisionList[i].y);
				var tmpImgData = ctx.createImageData(1,1);
				tmpImgData.data[0] = tmpImgData.data[2] = 0
				tmpImgData.data[1] = tmpImgData.data[3] = 255;
				ctx.putImageData(tmpImgData, this.x + this.collisionList[i].x, this.y + this.collisionList[i].y);
				//console.log(sobelX[pos],sobelY[pos]);
				//this.velY = -10;
				//this.velX = 1;
			}
		}
		if (collisionCount > 0 && !this.ignoreNextCol){
			console.log("CollisionCount",collisionCount);
			console.log(dirCounts);
			var xConfused = Math.abs(dirCounts[0] - dirCounts[1]) < Math.abs(dirCounts[0] + dirCounts[1])/4;//Difference than less than half the average
			var yConfused = Math.abs(dirCounts[2] - dirCounts[3]) < Math.abs(dirCounts[2] + dirCounts[3])/4;//Difference than less than half the average
			console.log("x confused",xConfused);
			console.log("y confused",yConfused);
			
			
			var futureX = this.x;
			var futureY = this.y;
			this.x -= this.velX;
			this.y -= this.velY;
			
			var dx = 0;
			var dy = 0;
			
			var velLen = Math.sqrt(this.velY*this.velY + this.velX*this.velX);
			
			function testCollision(ball){
				collisionCount = 0;
				edgeXSum = 0;
				edgeYSum = 0;
				for (var i = 0; i < ball.collisionList.length; i++){
					pos = xyToPos(Math.floor(ball.x) + ball.collisionList[i].x, Math.floor(ball.y) + ball.collisionList[i].y);

					if (sobelX[pos] > ball.collisionThreshold || 
						sobelX[pos] < -ball.collisionThreshold||
						sobelY[pos] > ball.collisionThreshold ||
						sobelY[pos] < -ball.collisionThreshold){
					
						collisionCount++;
						edgeXSum += sobelX[pos];
						edgeYSum += sobelY[pos];
					}
				}
				return collisionCount;//(collisionCount != 0?collisionCount:1);
			}
			if (velLen != 0){
				if (velLen == Math.abs(this.velX)){//No Y component
					dx = this.velX/Math.abs(this.velX);
					while (testCollision(this) == 0 && this.x != futureX){
						this.x += dx;
						this.draw();
					}
				}else if (velLen == Math.abs(this.velY)){//No X component
					dy = this.velY/Math.abs(this.velY);
					while (testCollision(this) == 0 && this.y != futureY){
						this.y += dy;
						this.draw();
					}
				}else{//Diagonal
					if (Math.abs(this.velY) > Math.abs(this.velX)){
						dx = this.velX / Math.abs(this.velY);
						dy = this.velY/Math.abs(this.velY);
					}else{
						dy = this.velY / Math.abs(this.velX);
						dx = this.velX/Math.abs(this.velX);	
					}
					while (testCollision(this) == 0 && this.y != futureY){
						this.x += dx;
						this.y += dy;
						this.draw();
					}
				}
				//New position of x,y is the first collision location.
				this.x = Math.floor(this.x);
				this.y = Math.floor(this.y);
				console.log("Got first collision?");
				if (collisionCount == 0){
					collisionCount = 1;
				}
			}
			
			
			
			
			
			
			
			console.log("EdgeXSum",edgeXSum, "EdgeYSum",edgeYSum,"EdgeX",edgeXSum/collisionCount, "EdgeY",edgeYSum/collisionCount);
			var edgeY = edgeYSum/collisionCount;
			var edgeX = edgeXSum/collisionCount;
			console.log("BallVelocity",this.velY, this.velX);
			console.log("BallSpeed", Math.sqrt(this.velY*this.velY + this.velX*this.velX));
			console.log("BallAngle", Math.atan2(this.velY, this.velX)/Math.PI/2*360);
			console.log("Normal?",Math.atan2(edgeY,edgeX)/Math.PI/2*360);
			var ballAngle = Math.atan2(this.velY, this.velX);
			var ballSpeed = Math.sqrt(this.velY*this.velY + this.velX*this.velX);
			var normal = Math.atan2(edgeY,edgeX);
			console.log("BallReflectAngle", (2*normal - ballAngle)/Math.PI/2*360);
			var ballReflectAngle = 2*normal - ballAngle;
			console.log("BallNewVelY", Math.sin(ballReflectAngle)*ballSpeed);
			console.log("BallNewVelX", Math.cos(ballReflectAngle)*ballSpeed);
			
			var damp = 0.80;
			this.velY = -Math.floor(Math.sin(ballReflectAngle)*ballSpeed*damp);// + Math.floor(edgeYSum/collisionCount/40);;
			this.velX = -Math.floor(Math.cos(ballReflectAngle)*ballSpeed*damp);// + Math.floor(edgeXSum/collisionCount/40);;
			
		}
		/*
			if(xConfused){
				//this.velX *= -1;//Math.floor(edgeXSum/collisionCount/15);//0;
				//this.velX = -Math.floor(Math.cos(normal)*this.terminalVel);
				
				//Back it up.
				var futureX = this.x;
				var futureY = this.y;
				this.x -= this.velX;
				this.y -= this.velY;
				
				var dx = 0;
				var dy = 0;
				
				var velLen = Math.sqrt(this.velY*this.velY + this.velX*this.velX);
				
				function testCollision(ball){
					collisionCount = 0;
					edgeXSum = 0;
					edgeYSum = 0;
					for (var i = 0; i < ball.collisionList.length; i++){
						pos = xyToPos(Math.floor(ball.x) + ball.collisionList[i].x, Math.floor(ball.y) + ball.collisionList[i].y);

						if (sobelX[pos] > ball.collisionThreshold || 
							sobelX[pos] < -ball.collisionThreshold||
							sobelY[pos] > ball.collisionThreshold ||
							sobelY[pos] < -ball.collisionThreshold){
						
							collisionCount++;
							edgeXSum += sobelX[pos];
							edgeYSum += sobelY[pos];
						}
					}
					return collisionCount;
				}
				if (velLen != 0){
					if (velLen == Math.abs(this.velX)){//No Y component
						dx = this.velX/Math.abs(this.velX);
						while (testCollision(this) == 0 && this.x != futureX){
							this.x += dx;
						}
					}else if (velLen == Math.abs(this.velY)){//No X component
						dy = this.velY/Math.abs(this.velY);
						while (testCollision(this) == 0 && this.y != futureY){
							this.y += dy;
						}
					}else{//Diagonal
						if (Math.abs(this.velY) > Math.abs(this.velX)){
							dx = this.velX / Math.abs(this.velY);
							dy = this.velY/Math.abs(this.velY);
						}else{
							dy = this.velY / Math.abs(this.velX);
							dx = this.velX/Math.abs(this.velX);	
						}
						while (testCollision(this) == 0 && this.y != futureY){
							this.x += dx;
							this.y += dy;
						}
					}
					//New position of x,y is the first collision location.
					this.x = Math.floor(this.x);
					this.y = Math.floor(this.y);
					console.log("X-Confused, Got first collision?");
					return;
				}
				
				//this.ignoreNextCol = true;
			}else{
				this.velX = -Math.floor(Math.cos(ballReflectAngle)*ballSpeed);
			}
			if(yConfused){
				//this.velX *= -1;//Math.floor(edgeXSum/collisionCount/15);//0;
				//this.velX = -Math.floor(Math.cos(normal)*this.terminalVel);
				
				//Back it up.
				var futureX = this.x;
				var futureY = this.y;
				this.x -= this.velX;
				this.y -= this.velY;
				
				var dx = 0;
				var dy = 0;
				
				var velLen = Math.sqrt(this.velY*this.velY + this.velX*this.velX);
				
				function testCollision(ball){
					collisionCount = 0;
					edgeXSum = 0;
					edgeYSum = 0;
					for (var i = 0; i < ball.collisionList.length; i++){
						pos = xyToPos(Math.floor(ball.x) + ball.collisionList[i].x, Math.floor(ball.y) + ball.collisionList[i].y);

						if (sobelX[pos] > ball.collisionThreshold || 
							sobelX[pos] < -ball.collisionThreshold||
							sobelY[pos] > ball.collisionThreshold ||
							sobelY[pos] < -ball.collisionThreshold){
						
							collisionCount++;
							edgeXSum += sobelX[pos];
							edgeYSum += sobelY[pos];
						}
					}
					return collisionCount;
				}
				if (velLen != 0){
					if (velLen == Math.abs(this.velX)){//No Y component
						dx = this.velX/Math.abs(this.velX);
						while (testCollision(this) == 0 && this.x != futureX){
							this.x += dx;
						}
					}else if (velLen == Math.abs(this.velY)){//No X component
						dy = this.velY/Math.abs(this.velY);
						while (testCollision(this) == 0 && this.y != futureY){
							this.y += dy;
						}
					}else{//Diagonal
						if (Math.abs(this.velY) > Math.abs(this.velX)){
							dx = this.velX / Math.abs(this.velY);
							dy = this.velY/Math.abs(this.velY);
						}else{
							dy = this.velY / Math.abs(this.velX);
							dx = this.velX/Math.abs(this.velX);	
						}
						while (testCollision(this) == 0 && this.y != futureY){
							this.x += dx;
							this.y += dy;
						}
					}
					//New position of x,y is the first collision location.
					this.x = Math.floor(this.x);
					this.y = Math.floor(this.y);
					console.log("Y-Confused, Got first collision?");
					return;
				}
				//this.ignoreNextCol = true;
			}else{
				this.velY = -Math.floor(Math.sin(ballReflectAngle)*ballSpeed);
			}
			//this.velY = Math.floor(edgeYSum/collisionCount/15);
			//this.velX = Math.floor(edgeXSum/collisionCount/15);
			console.log(Math.atan2(edgeXSum,edgeYSum)/Math.PI/2*360);
		}else{
			this.ignoreNextCol = false;
		}
		*/
		

		if (this.velY > this.terminalVel){this.velY = this.terminalVel;}
		if (this.velY < -this.terminalVel){this.velY = -this.terminalVel;}
		if (this.velX > this.terminalVel){this.velX = this.terminalVel;}
		if (this.velX < -this.terminalVel){this.velX = -this.terminalVel;}
		
		
		
		this.x += this.velX;
		this.y += this.velY;
		this.velY += this.accelY;
		
		if (this.y + this.radius*2 > canvas.height){
			this.velY *= -1;
			this.y = canvas.height - this.radius*2;
		}
		if (this.x < 0 || this.x + this.radius*2 > canvas.width){
			this.velX *= -1;
			if (this.x < 0){
				this.x = 0;
			}else{
				this.x = canvas.width - this.radius*2;
			}
		}
		
		
	}
}




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
