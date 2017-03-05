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
