//Create the Canvas
var canvas = createCanvas(640, 480, "solid 2px green", true);
//Center the Canvas
canvas.className = "center";
//Get Canvas Context
var ctx = canvas.getContext("2d");

//When the image loads, start the module.
document.getElementById("img").addEventListener('load', main, false);

//Handle Mouse Events
var dropIt = true;
canvas.addEventListener("mousemove",function(e){
	var canvasRect = canvas.getBoundingClientRect();
	if (!dropIt){
		ball.velX = 0;
		ball.velY = 0;
		ball.x = e.clientX - canvasRect.left - ball.radius;
		ball.y = e.clientY - canvasRect.top - ball.radius;
		//loadImage();
		draw();
	}else{
		//ball.velX = -(ball.x - (e.clientX - canvasRect.left));
		//ball.velY = -(ball.y - (e.clientY - canvasRect.top));
	}
});
canvas.addEventListener("click",function(e){
	dropIt = !dropIt;
	//draw();
});

//Main module, "entry" point of the program
function main(){
	loadImage();
	
	
	
	document.getElementById("btnAnimate").disabled = false;
}

function loadImage(){
	//Make variable img represent the source image
	var img = document.getElementById("img");
	//Set the canvas the size of the img
	canvas.width = img.width;
	canvas.height = img.height;
	//Draw the Image
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

//TODO will need the following passed to it:  ctx.getImageData(x1, y1, x2, y2); where parameters are the window
//Filter the ImageData provided using a Grayscale Filter.
//Return the grayscale data in object with its hieght, width, and values in an Uint8ClampedArray.
function filterGrayscale(imgData){
	var gs = new Uint8ClampedArray(imgData.width * imgData.height);
	for (var i = 0; i < imgData.data.length; i += 4){
		var pos = i / 4;
		var y = Math.floor(pos / canvas.width);
		var x = pos - y * canvas.width;
		
		gs[pos] = 0.299 * imgData.data[i] + 0.587 * imgData.data[i + 1] + 0.114 * imgData.data[i + 2];
	}
	return { 
		height: imgData.height,
		width: imgData.width,
		data: gs
	};
}
//Given Grayscale data, return the Sobel Edge data
//The Sobel data is has its height and width subtracted by 2 compared to the Grayscale data.
//The Sobel data has too parts, an X component and a Y component.
function filterSobel(gsData){
	var h = gsData.height;
	var w = gsData.width;
	if (h < 3 || w < 3){
		console.log("Image to small: cannot run Sobel filter.");
		return {
			height: 0,
			width: 0,
			dataX: null,
			dataY: null
		};
	}
	var sobelX = new Int16Array((h - 2) * (w - 2));
	var sobelY = new Int16Array((h - 2) * (w - 2));
	var pos;
	var sX;
	var sY;
	for (var y = 1; y < h - 1; y++){
		for (var x = 1; x < w - 1; x++){
			pos = xyToPos(x - 1, y - 1, w - 2);
			
			sX = 0;
			sX += -1*gsData.data[xyToPos(x - 1, y - 1, w)];
			sX += -2*gsData.data[xyToPos(x - 1, y, w)];
			sX += -1*gsData.data[xyToPos(x - 1, y + 1, w)];
			sX += 1*gsData.data[xyToPos(x + 1, y - 1, w)];
			sX += 2*gsData.data[xyToPos(x + 1, y, w)];		
			sX += 1*gsData.data[xyToPos(x + 1, y + 1, w)];
			sobelX[pos] = Math.floor(sX);
			
			sobelY[pos] = 0;
			sobelY[pos] += -1*gsData.data[xyToPos(x - 1, y - 1, w)];
			sobelY[pos] += -2*gsData.data[xyToPos(x, y - 1, w)];
			sobelY[pos] += -1*gsData.data[xyToPos(x + 1, y - 1, w)];
			sobelY[pos] += 1*gsData.data[xyToPos(x - 1, y + 1, w)];
			sobelY[pos] += 2*gsData.data[xyToPos(x, y + 1, w)];
			sobelY[pos] += 1*gsData.data[xyToPos(x + 1, y + 1, w)];
			sobelY[pos] = Math.floor(sY);
		}
	}
	return {
		height: gsData.height - 2,
		width: gsData.width - 2,
		dataX: sobelX,
		dataY: sobelY
	};
}

function xyToPos(x, y, width){
	return y*width + x;
}









var grayscale = [];

//Create the load image button.
var button2 = document.createElement("button");
button2.innerHTML = "Grayscale";
button2.addEventListener('click',function(){
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	filterGrayscale(imgData);
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

/*
function xyToPos(x, y){
	return y*canvas.width + x;
}*/
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
