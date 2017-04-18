//Image File Loader
function loadImages(src){
	alert("Length: "+src.length);
	document.getElementById("img").src = src;
}

function handleFileSelect(evt) {
	alert("Getting Image: "+evt.target.files[0].name);
	try{
		var files = evt.target.files; // FileList object
		var reader = new FileReader();
		reader.onload = function(e){
			loadImages(e.target.result);
		}
		reader.onerror = function(e){
			alert("Error when Reading: "+e.target.error.code);
		}
		// Read in the image file as a data URL.
		if (files[0].size > 0){
			reader.readAsDataURL(files[0]);
		}else{alert("Empty File? Error Getting File?");}
	}catch(e){alert(e);}
}
//END Image File Loader

//Add the ImageFileLoader
document.getElementById('files').addEventListener('change', handleFileSelect, false);
