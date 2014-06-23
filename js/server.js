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
      // document.getElementById("hiddenImage").src = canvas.toDataURL();
    }
    img.src=oFREvent.target.result;
  };

  function loadImage() {
    getLocation();
    if (document.getElementById("file").files.length === 0) { return; }
    var oFile = document.getElementById("file").files[0];
    if (!rFilter.test(oFile.type)) { alert("You must select a valid image file!"); return; }
    $("#yourimage").attr("src", URL.createObjectURL(oFile));
      $("#yourimage").show();
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
         // file: {
         //     required: true,
         //     accept: "image"
         // },
        submitHandler: function(form) {
            // need something here
            return false;
        }
    }
  });*/

/* post form info to server */
// $("#sendButton").bind("click", function (event, ui) {
  $(document).on("click", "#sendButton", function() {
   // $("#form1").submit(function(e) {
      // e.preventDefault();

    var file = document.getElementById('file').files[0];
    var key = "events/" + (new Date).getTime() + '-' + file.name; //uploads to this folder and name

    // getting values of form fields
//    var id = $("#IDText").val();    
    var id = parseInt((Math.random() * 1000000) + 10); // rand 10 - 1000000

    var title = $("#TitleText").val();
    var desc = $("#descText").val();
    var category = $("#categoryText").val();
    var imgURL = "https://exploretasman.s3.amazonaws.com/" + key;
    var gps = $("#locationText").val(); //location text
    // var imgURL = $(".test img").attr("src"); //base64 of image

// if any fields are empty then cant upload
if (!title || !desc || !category) {
  alert("Some fields are empty and need to be filled out!");
      // e.preventDefault();

}

else if (!gps) {
  alert("Couldn't retrieve GPS coordinates so upload can't be shown on map.");
      // e.preventDefault();

}

else {
    $("#form1").submit(function(e) {
      e.preventDefault();
  var url = "http://intense-harbor-6396.herokuapp.com/upload";

  // var url = "http://localhost:3000/upload";
  uploadFile(file, key); //call so can upload file to S3
  var inJSON = {
    "id": id,
    "title": title,
    "description": desc,
    "category": category,
    "gps": gps,
    "url": imgURL
  };

  // sending to server
$.ajax({
  type: "POST",
  url: url,
  data: inJSON,
  dataType: "json",
  async: true,
  success:function(data) {
      console.log("posting: ", inJSON);
      alert("Upload complete!");
      //window.location = "main.html#camera"
    $.mobile.changePage("main.html/#camera");
  },
  error:function(error){
    alert("There was an error! " + error);
    $.mobile.changePage("main.html");
  },
  complete:function() {
    // $.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
    $.mobile.changePage("main.html/#camera");
    $("#yourimage").hide();
    $("#form1").each(function(){
      this.reset();
    });
  }
});

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
    xhr.open('POST', 'https://exploretasman.s3.amazonaws.com/', true); //MUST BE LAST LINE SO WE CAN SEND 
    xhr.send(fd);
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

 // encryption of secret and policy...
var secret64 = "dG1MRDNQOEl3ZlVic1hxN3Y4NzFldmJaeWplaDE1dkVudk1ZbEZHZw==";
var secret = window.atob(secret64);
var policy = JSON.stringify(POLICY_JSON);
var policyBase64 = window.btoa(policy);


/* **************************** 
        Show gallery
****************************** */

    // GET images from database and createGallery()
  $(document).on("pagebeforeshow", "#gallery", function() {
    var url = "http://intense-harbor-6396.herokuapp.com/gallery";
    var json = [];
    $.get(url, function (data) {
      console.log("data ", data)
      createGallery(data);
    });
  });

// appends images onto screen
  function createGallery(json) {
  var output = ""; // initialize it outside the loop
  $.each(json, function () {
    output += '<a href = "' + this.imageurl + '" rel="external"> <img src= "' + this.imageurl + '" alt = "' + this.title + '" class = "class"/> </a> ';
  });
  $('.items').append(output); //append onto page
}

 // Opens Photoswipe when tapped onto image
  $(document).on("tap", "#gallery", function() {
    var myPhotoSwipe = $(".items a").photoSwipe({
      jQueryMobile: true,
      loop: true,
      enableMouseWheel: false,
      enableKeyboard: false
    });
    // myPhotoSwipe.show(0);
  });

 // removes images so can load new uploaded images
  $(document).on("pagehide", "#gallery", function() {
      $('.items a').remove();
  });

// hide preview of image when clear-btn is pressed
$(document).on('click', '#check .ui-input-clear', function () {
    $("#yourimage").hide();
});