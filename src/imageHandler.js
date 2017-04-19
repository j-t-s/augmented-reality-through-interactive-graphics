//Create the Canvases and Contexts
var canvas = createCanvas(640, 480, "solid 2px green", true);
canvas.className = "center";
var ctx = canvas.getContext("2d");

var canvasIn = createCanvas(640, 480, "", false);
var ctxIn = canvasIn.getContext("2d");

//Create the ball
var ball = new Ball();

//Create running animation variable
var running = true;

var streaming = false;
var video = document.createElement("video");
document.body.appendChild(video);

navigator.getMedia = (	navigator.getUserMedia || 
						navigator.webkitGetUserMedia ||
						navigator.mozGetUserMedia ||
						navigator.msGetUserMedia );
navigator.getMedia({video: true, audio: false}, 
	function(stream){
		if (navigator.mozGetUserMedia){
			video.mozSrcObject = stream;			
		}else{
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL.createObjectURL(stream);
		}
		video.play();
	},
	function(err){
		console.log("Error: "+err);
	}
);

video.addEventListener("canplay",
	function(e){
		if (!streaming){
			streaming = true;
			loadVideo();
		}
	},
	false
);
function loadVideo(){
	canvas.width = canvasIn.width = video.videoWidth;
	canvas.height = canvasIn.height = video.videoHeight;
	//Draw the Image
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	ctxIn.drawImage(video, 0, 0, canvas.width, canvas.height);
	
}




//When the image loads, start the module.
document.getElementById("img").addEventListener("load", main, false);

//Main module, "entry" point of the program
function main(){
	loadImage();
	document.getElementById("btnAnimate").disabled = false;
}

function loadImage(){
	//Make variable img represent the source image
	var img = document.getElementById("img");
	//Set the canvas the size of the img
	canvas.width = canvasIn.width = img.width;
	canvas.height = canvasIn.height = img.height;
	//Draw the Image
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	ctxIn.drawImage(img, 0, 0, canvas.width, canvas.height);
}

//Handle Animation Button
document.getElementById("btnAnimate").addEventListener("click", toggleAnimation, false);

function toggleAnimation(){
	var btnAnimate = document.getElementById("btnAnimate");
	var filesInput = document.getElementById("files");
	filesInput.disabled = !filesInput.disabled;
	
	if (filesInput.disabled == true){//Run animation, user cannot change picture.
		btnAnimate.innerHTML = "Stop";
		running = true;
		if (checkImgLoaded()){
			window.requestAnimationFrame(draw);
		}
	}else{//Stop the animation
		btnAnimate.innerHTML = "Animate";
		running = false;
	}
}

function checkImgLoaded(){
	var img = document.getElementById("img");
	return ((img.height*img.width) > 0);
}

function draw(){
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	ctxIn.drawImage(video, 0, 0, canvas.width, canvas.height);
	ball.draw();
	ball.update();
	
	if (running){
		setTimeout(function(){window.requestAnimationFrame(draw);},15);//30);
		//window.requestAnimationFrame(draw);
	}
}

//Handle Mouse Events
canvas.addEventListener("mousemove",function(e){
	var canvasRect = canvas.getBoundingClientRect();
	if (!running && checkImgLoaded()){
		ball.velX = 0;
		ball.velY = 0;
		ball.x = e.clientX - canvasRect.left - ball.radius;
		ball.y = e.clientY - canvasRect.top - ball.radius;
		loadImage();
		draw();
	}
});
canvas.addEventListener("click",function(e){
	if(checkImgLoaded()){
		toggleAnimation()
		loadImage();
		draw();
	}
});


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
			
			sY = 0;
			sY += -1*gsData.data[xyToPos(x - 1, y - 1, w)];
			sY += -2*gsData.data[xyToPos(x, y - 1, w)];
			sY += -1*gsData.data[xyToPos(x + 1, y - 1, w)];
			sY += 1*gsData.data[xyToPos(x - 1, y + 1, w)];
			sY += 2*gsData.data[xyToPos(x, y + 1, w)];
			sY += 1*gsData.data[xyToPos(x + 1, y + 1, w)];
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
