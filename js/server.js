$(document).ready(function () {
    console.log('onReady');
    $("#file").on("change", previewImage);
});

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
$("#form1").validate({
    rules: {
        IDText: {
            required: true
        },
        TitleText: {
            required: true
        },
        descText: {
            minlength: 5
        },
        categoryText: {
            required: true
        },
        file: {
            required: true
        },
        submitHandler: function(form) {
            // need something here
        }
    }
});

/* post form info to server */
$("#sendButton").bind("click", function (event, ui) {
    var file = document.getElementById('file').files[0];
    var key = "events/" + (new Date).getTime() + '-' + file.name; //uploads to this folder and name

    // getting values of form fields
    var id = $("#IDText").val();
    var title = $("#TitleText").val();
    var desc = $("#descText").val();
    var category = $("#categoryText").val();
    var imgURL = "https://exploretasman.s3.amazonaws.com/" + key;
    var gps = $("#locationText").val(); //location text


// if any fields are empty then cant upload
if (!id || !title || !category) {
    alert("Some fields are empty and need to be filled out!");
}

else {
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