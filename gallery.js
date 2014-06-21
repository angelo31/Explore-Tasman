//  $(document).on("pagebeforeshow", "#galleryLink", function() {
$(document).ready(function() {
      alert("here")
    var url = "http://intense-harbor-6396.herokuapp.com/gallery";
    var json = [];
    $.get(url, function (data) {
      console.log("data ", data)
      createGallery(data);
    });
  });


  function createGallery(json) {
  var output = ""; // initialize it outside the loop
  $.each(json, function () {
    output += '<a href = "' + this.imageurl + '" rel="external"> <img src= "' + this.imageurl + '" alt = "' + this.title + '" class = "class"/> </a> ';
  });
  $('.items').append(output); //append onto page
}

// $(document).on('pagecreate', '#gallery', function () {
  $(document).on("tap", "#gallery", function() {
    var myPhotoSwipe = $(".items a").photoSwipe({
      jQueryMobile: true,
      loop: true,
      enableMouseWheel: false,
      enableKeyboard: false
    });
    // myPhotoSwipe.show(0);
  });