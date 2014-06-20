$(document).ready(function () {
  console.log('onReady');
  $("#file").on("change", loadImage);
});


oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

oFReader.onload = function (oFREvent) {

  var img=new Image();
  img.onload=function(){
    var canvas=document.createElement("canvas");
    var ctx=canvas.getContext("2d");

    var currW = img.width;
    var currH = img.height
    var ratio = currH / currW;
    var maxW = 622;
    var maxH = 350;

    if (img.width >= maxW && ratio <= 1) {
      currW = maxW;
      currH = currW * ratio;
    }

    else 
      if (currH >= maxH) {
        currH = maxH;
        currW = currH / ratio;
      }

      canvas.width=currW;
      canvas.height=currH;
      ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
      document.getElementById("hiddenImage").src = canvas.toDataURL();

      // var dataurl = canvas.toDataURL();
    }
    img.src=oFREvent.target.result;
  };

  function loadImage() {
    getLocation();
    if (document.getElementById("file").files.length === 0) { return; }
    var oFile = document.getElementById("file").files[0];
    if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
    $("#yourimage").attr("src", URL.createObjectURL(oFile));
    oFReader.readAsDataURL(oFile);
  }


//Credit: https://www.youtube.com/watch?v=EPYnGFEcis4&feature=youtube_gdata_player
function previewImage(event) {
    getLocation(); // get location of where user is uploading photo 
    if (event.target.files.length == 1 && event.target.files[0].type.indexOf("image/") == 0) {
      var blob = event.target.files[0];
         $("#yourimage").attr("src", URL.createObjectURL(blob)); //makes it able to display blob as an image....
       }
     }

     $.ajaxSetup ({
      cache: false
    });

     function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
       alert("Geolocation is not supported :(");
     }
   }

   function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var data = lat + "," + lon;
    $("#locationText").val(data);
  }

  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
      case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
      case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
      case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
    }
  }

  /* Form validation... */
/*$("#form1").validate({
    rules: {
        IDText: {
            required: true
        },
        TitleText: {
            required: true
        },
        descText: {
            required: true,
            minlength: 5
        },
        categoryText: {
            required: true
        },
         file: {
             required: true,
             accept: "image"
         },
        submitHandler: function(form) {
            // need something here
        }
    }
  });*/

/* post form info to server */
// $("#sendButton").bind("click", function (event, ui) {
  $(document).on("click", "#sendButton", function() {
    var file = document.getElementById('file').files[0];
    var key = "events/" + (new Date).getTime() + '-' + file.name; //uploads to this folder and name

    // getting values of form fields
    var id = $("#IDText").val();
    var title = $("#TitleText").val();
    var desc = $("#descText").val();
    var category = $("#categoryText").val();
    var imgURL = "https://exploretasman.s3.amazonaws.com/" + key;
    var gps = $("#locationText").val(); //location text

    // var imgURL = $(".test img").attr("src"); //base64 of image

// if any fields are empty then cant upload
if (!id || !title || !category) {
  alert("Some fields are empty and need to be filled out!");
}

else if (!gps) {
  alert("Couldn't retrieve GPS coordinates so upload can't be shown on map.");
}

else {
  var url = "http://intense-harbor-6396.herokuapp.com/upload";
            // var url = "http://localhost:3000/upload";
            // uploadFile(file, key); //call so can upload file to S3
            var inJSON = {
              "id": id,
              "title": title,
              "description": desc,
              "category": category,
              "gps": gps,
              "url": imgURL
            };

            console.log("posting: ", inJSON);
            
            // sending to server
            // $.post(url, inJSON, function (data) {
            // }, "json");

$.ajax({
  type: "POST",
  url: url,
  data: inJSON,
  dataType: "json",
  success:function(data) {
    alert("Upload complete!")
  },
  error:function(error){
    alert("Error: " + error);
  },
  complete:function() {
    $("#form1").each(function(){
      this.reset();
    });
  }
});
}
});

// uploading file to s3 bucket
function uploadFile(file, key) {
  var fd = new FormData();
  fd.append('key', key);
  fd.append('acl', 'public-read'); 
  fd.append('Content-Type', file.type);      
  fd.append('AWSAccessKeyId', 'AKIAJJUYC4EAIF7D2XDQ');
  fd.append('policy', policyBase64)
  fd.append('signature',"sGRBx76tlCjZ8xTTPZS7wT/q+oQ=");
  fd.append("file",file);

  var xhr = new XMLHttpRequest();
    // xhr.upload.addEventListener("progress", uploadProgress, false);
    // xhr.addEventListener("load", uploadComplete, false);
    // xhr.addEventListener("error", uploadFailed, false);
    // xhr.addEventListener("abort", uploadCanceled, false);

    xhr.open('POST', 'https://exploretasman.s3.amazonaws.com/', true); //MUST BE LAST LINE BEFORE YOU SEND 
    xhr.send(fd);
  }

  function uploadProgress(evt) {
    if (evt.lengthComputable) {
      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
      // document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
      $("#progressNumber").val(percentComplete.toString() + '%')
    }
    else {
      document.getElementById('progressNumber').innerHTML = 'unable to compute';
    }
  }

  function uploadComplete(evt) {
    /* This event is raised when the server send back a response */
    alert("Upload complete!" + evt.target.responseText );
  }

  function uploadFailed(evt) {
    alert("There was an error attempting to upload the file." + evt);
  }

  function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
  }

// var experiation = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
"conditions": [
{"bucket": "exploretasman"},
["starts-with", "$key", ""],
{"acl": "public-read"},                           
["starts-with", "$Content-Type", ""],
["content-length-range", 0, 524288000] //max file size is 500MB?
]};

var secret64 = "dG1MRDNQOEl3ZlVic1hxN3Y4NzFldmJaeWplaDE1dkVudk1ZbEZHZw==";
var secret = window.atob(secret64);
var policy = JSON.stringify(POLICY_JSON);
var policyBase64 = window.btoa(policy);
/*
var json = 
[{"title":"Abel Tasman Beach","imageurl":"http://www.abeltasman.co.nz/assets/Uploads/_resampled/SetWidth600-W-WilsonsAbelTasman08-Tonga-Quarrycrop-llr.jpg"},{"title":"Cute bird","imageurl":"http://www.abeltasman.co.nz/assets/image-gallery/wildlife/_resampled/SetWidth600-DSC2.JPG"},{"title":"Scary!!","imageurl":"http://www.abeltasman.co.nz/assets/image-gallery/wildlife/_resampled/SetWidth600-sting2.jpg"},{"title":"Waterfall","imageurl":"http://www.abeltasman.co.nz/assets/Uploads/_resampled/SetWidth600-S-WilsonsAbelTasman06BarkFalls-crop2.jpg"},{"title":"Dat Fauna","imageurl":"http://www.abeltasman.co.nz/assets/Uploads/_resampled/SetHeight600-W-WilsonsAbelTasmanFern-bridge-llr.jpg"},{"title":"Beach with forest","imageurl":"http://www.abeltasman.co.nz/assets/Uploads/_resampled/SetWidth600-Beach-Walk-llr.jpg"},{"title":"Sea Lion","imageurl":"http://www.abeltasman.co.nz/assets/image-gallery/wildlife/_resampled/SetWidth600-K-Wilsons-AbelTasman52KySeal-web-crop2.jpg"},{"title":"Test","imageurl":"https://exploretasman.s3.amazonaws.com/events/1402909244471-1402049918718.jpg"},{"title":"Testing","imageurl":"https://exploretasman.s3.amazonaws.com/events/1402911739896-1402240620639.jpg"},{"title":"tt","imageurl":"https://exploretasman.s3.amazonaws.com/events/1402972044630-1402972019880.jpg"},{"title":"title for thing","imageurl":"https://exploretasman.s3.amazonaws.com/events/1402972105051-Tasman island.jpg"},{"title":"drerfgdfgfdg","imageurl":"https://exploretasman.s3.amazonaws.com/events/1402972130329-Frenchmans bay.jpg"},{"title":"456","imageurl":"https://exploretasman.s3.amazonaws.com/events/1403082920157-icon.png"},{"title":"Happy new year to you","imageurl":"https://exploretasman.s3.amazonaws.com/events/1403092418136-IMAG0465.jpg"},{"title":"Test title","imageurl":"https://exploretasman.s3.amazonaws.com/events/1403093122097-IMAG0465.jpg"},{"title":" test the bus.","imageurl":"https://exploretasman.s3.amazonaws.com/events/1403082920157-icon.png"}];*/ 

$(document).on("click", "#galleryButton", function() {
  var url = "http://intense-harbor-6396.herokuapp.com/gallery";
  var json = [];
  $.get(url, function (data) {
    json = data;
    createGallery(json);
  });
});

function createGallery(json) {
  var output = ""; // initialize it outside the loop
  $.each(json, function () {
    output += '<a href = "' + this.imageurl + '" rel="external"> <img src= "' + this.imageurl + '" alt = "' + this.title + '" class = "class"/> </a> ';
  });
  $('.items').append(output); //append onto page
}

$(document).on('pagecreate', '#gallery', function () {
  var myPhotoSwipe = $(".items a").photoSwipe({
    jQueryMobile: true,
    loop: true,
    enableMouseWheel: false,
    enableKeyboard: false
  });
    // myPhotoSwipe.show(0);
  });