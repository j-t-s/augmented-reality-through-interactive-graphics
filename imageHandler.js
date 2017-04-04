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
		
		imgData.data[i+3] = 255;
	}
	ctx.putImageData(imgData, 0, 0);
}

var interval;
//Create the load image button.
var button4 = document.createElement("button");
button4.innerHTML = "Animate";
button4.addEventListener('click',function(){
	interval = setInterval(draw, 1000);
}, false);
document.body.appendChild(button4);

var button5 = document.createElement("button");
button5.innerHTML = "Stop";
button5.addEventListener('click',function(){
	clearInterval(interval);
}, false);
document.body.appendChild(button5);

function draw(){
	drawSobel();
	console.log("Hello Draw");
	
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
