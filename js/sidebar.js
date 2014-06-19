$(document).ready(function(){
    //when the button is clicked
    $("#showMenu").click(function(){
    //apply togglele classes
    $("#nav").toggleClass("show");
    $("#showMenu").toggleClass("moveButton");
    });    
    
    $("#map").click(function(){
        $("#nav").removeClass("show");
        $("#showMenu").removeClass("moveButton");    
    });
});
