//Ball constructor
function Ball(x, y, velX, velY, accelX, accelY, damp, collisionThreshold) {
	this.x = (typeof x !== 'undefined') ? x : 50;
	this.y = (typeof y !== 'undefined') ? y : 50;
	this.radius = 10;
	
	this.velX = (typeof velX !== 'undefined') ? velX : 0;
	this.velY = (typeof velY !== 'undefined') ? velY : 0;
	this.terminalVel = 10;
	
	this.accelY = (typeof accelY !== 'undefined') ? accelY : 1;
	this.accelX = (typeof accelX !== 'undefined') ? accelX : 0;
	
	this.damp = (typeof damp !== 'undefined') ? damp : 0.75;
	
	this.collisionList = [];
	this.collisionThreshold = (typeof collisionThreshold !== 'undefined') ? collisionThreshold : 50;
	
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
		
		//TODO !!!! Fix the line below!!! You should not be getting a subImage of the context you are drawing one. False positives.
		var subImage = ctx.getImageData(Math.floor(this.x) - 1, Math.floor(this.y) - 1, this.radius*2 + 2, this.radius*2 + 2);
		var sobelEdge = filterSobel(filterGrayscale(subImage));
		
		for (var i = 0; i < this.collisionList.length; i++){
			var pos = xyToPos(this.collisionList[i].x, this.collisionList[i].y, sobelEdge.width);
			//sobelEdge.width should be the 2*radius

			if (sobelEdge.dataX[pos] > this.collisionThreshold || 
				sobelEdge.dataX[pos] < -this.collisionThreshold||
				sobelEdge.dataY[pos] > this.collisionThreshold ||
				sobelEdge.dataY[pos] < -this.collisionThreshold){
			
				this.collisionCount++;
				this.edgeXSum += sobelEdge.dataX[pos];
				this.edgeYSum += sobelEdge.dataY[pos];
				
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