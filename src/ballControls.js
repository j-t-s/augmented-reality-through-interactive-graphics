//ballControls uses methods and variables defined in imageHandler

//Handle Gravity Button
document.getElementById("btnGravity").addEventListener("click",
	function(){
		var btnGrav = document.getElementById("btnGravity");
		var isGrav;
		if (btnGrav.innerHTML == "No Gravity"){
			btnGrav.innerHTML = "Gravity";
			isGrav = false;
		}else{
			btnGrav.innerHTML = "No Gravity";
			isGrav = true;
		}
		
		if(!isGrav){
			if (Math.sqrt(ball.velX*ball.velX + ball.velY*ball.velY) <= 0){
				ball.velX = 5;
				ball.velY = 5;
			}
			ball.accelY = 0;
			ball.damp = 1.25; //Make the ball gain energy when bouncing
		}else{
			ball.accelY = 1;
			ball.damp = 0.75; //Make the ball lose energy when bouncing
		}
	},
	false
);

//Handle Edge Sensitivity Input
document.getElementById("rangeEdgeSensitivity").addEventListener("change",
	function(){
		//Subtract the sensitivity from 1020 (the maximum threshold) to give the new threshold
		ball.collisionThreshold = 1020 - parseInt(document.getElementById("rangeEdgeSensitivity").value);
	},
	false
);

//Handle Ball Size Input
document.getElementById("rangeBallSize").addEventListener("change",
	function(){
		ball.radius = parseInt(document.getElementById("rangeBallSize").value);
		ball.terminalVel = Math.floor(ball.radius);
		ball.createCollisionMask();
	},
	false
);

//Handle Mouse Events
canvas.addEventListener("mousemove",function(e){
	var canvasRect = canvas.getBoundingClientRect();
	if (!running && typeof canvasImgSource !== "undefined"){
		ball.velX = 0;
		ball.velY = 0;
		ball.x = e.clientX - canvasRect.left - ball.radius;
		if (mirror){
			ball.x = canvas.width - ball.x - 2*ball.radius;			
		}
		ball.y = e.clientY - canvasRect.top - ball.radius;
		updateCanvas();
		draw();
	}
});
canvas.addEventListener("click",function(e){
	if(typeof canvasImgSource !== "undefined"){
		toggleAnimation()
		updateCanvas();
		draw();
	}
});
