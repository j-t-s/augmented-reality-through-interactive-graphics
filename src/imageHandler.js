//Create the Canvases and Contexts
var canvas = createCanvas(640, 480, "solid 2px green", true);
canvas.className = "center";
var ctx = canvas.getContext("2d");

var canvasIn = createCanvas(640, 480, "", false);
var ctxIn = canvasIn.getContext("2d");

var canvasImgSource;

//Create video element for Webcam to stream video into.
var video = document.createElement("video");

//Create the ball
var ball = new Ball();

//Create running animation variable
var running = false;

//Mirror flag
var mirror = false;


//When the image loads in the browser, load the image into the program.
document.getElementById("img").addEventListener("load", loadImage, false);

//Try to activate the Webcam, and if it activates, load the frames into the program.
document.getElementById("btnWebcamActivate").addEventListener("click", loadWebcam, false);

function loadImage(){
	//Make variable img represent the source image
	var img = document.getElementById("img");
	//Make the image the CanvasImageSource
	canvasImgSource = img;
	//Set the canvas the size of the img
	canvas.width = canvasIn.width = img.width;
	canvas.height = canvasIn.height = img.height;
	//Draw the image
	updateCanvas();
	
	document.getElementById("btnAnimate").disabled = false;
	document.getElementById("files").disabled = true;
	document.getElementById("btnWebcamActivate").disabled = false;
	document.getElementById("btnGravity").disabled = false;
}

//Draw the image onto the canvas.
function updateCanvas(){
	ctx.drawImage(canvasImgSource, 0, 0, canvas.width, canvas.height);
	ctxIn.drawImage(canvasImgSource, 0, 0, canvas.width, canvas.height);
}

function loadWebcam(){
	//Modified from https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	// and Modified from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
	if (navigator.mediaDevices === undefined){
		navigator.mediaDevices = {};//Create empty object if not defined.
	}

	if (navigator.mediaDevices.getUserMedia === undefined){//If no getUserMedia, load the older API instead.
		navigator.mediaDevices.getUserMedia = function(contraints){
			var getMedia =(	navigator.getUserMedia || 
								navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia ||
								navigator.msGetUserMedia );
			if (!getMedia || typeof Promise === "undefined"){
				alert("Error: Not able to load Webcam.");
				console.log("getUserMedia: is not supported.");
				return;
			}else if (!getMedia && typeof Promise !== "undefined"){
				 return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
			}
			
			return new Promise(function(resolve, reject){
				getMedia.call(navigator, contraints, resovlve, reject);
			});
		}
	}

	navigator.mediaDevices.getUserMedia(
		{audio: false, video: true}
	).then(
		function(stream){
			if ("srcObject" in video){
				video.srcObject = stream;
			}else{
				video.src = window.URL.createObject(stream);
			}
			video.onloadedmetadata = function(e){
				//When the video loads, play it, and load the video into the program.
				video.play();
				loadVideo();
			};
		}
	).catch(
		function(err){
			console.log(err.name+": "+err.message);
		}
	);
}

function loadVideo(){
	//Make the video the CanvasImageSource
	canvasImgSource =  video;
	
	canvas.width = canvasIn.width = video.videoWidth;
	canvas.height = canvasIn.height = video.videoHeight;
	//Draw the Image, and give it a half a second to load.
	setTimeout(updateCanvas, 500);
	
	document.getElementById("btnWebcamActivate").disabled = true;
	document.getElementById("btnAnimate").disabled = false;
	document.getElementById("files").disabled = false;
	document.getElementById("btnGravity").disabled = false;
}


//Handle Animation Button
document.getElementById("btnAnimate").addEventListener("click", toggleAnimation, false);

function toggleAnimation(){
	var btnAnimate = document.getElementById("btnAnimate");
	var filesInput = document.getElementById("files");
	//filesInput.disabled = !filesInput.disabled;
	running = !running;
	
	if (running && typeof canvasImgSource !== "undefined"){//Run animation, user cannot change picture.
		btnAnimate.innerHTML = "Stop";
		filesInput.disabled = true;
		if (typeof canvasImgSource !== "undefined"){
			window.requestAnimationFrame(draw);
		}
	}else{//Stop the animation
		btnAnimate.innerHTML = "Animate";
		filesInput.disabled = false;
		running = false;
	}
}

//Handle Mirror Button
document.getElementById("btnMirror").addEventListener("click",
	function(){
		mirror = !mirror;
		if(mirror){
			canvas.className += " mirror";
		}else{
			canvas.className = canvas.className.replace(" mirror","");			
		}
	},
	false
);

function draw(){
	updateCanvas();
	
	ball.draw();
	ball.update();
	
	if (running){
		setTimeout(function(){window.requestAnimationFrame(draw);},15);//30);
		//window.requestAnimationFrame(draw);
	}
}


//Filters of Grayscale and Sobel were inspired by https://www.html5rocks.com/en/tutorials/canvas/imagefilters/

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
