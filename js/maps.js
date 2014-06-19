//Gmap3 currently use
$(document).on('pageshow','#home',function(event){ 
    /* Show map on screen */
    
   //Bounds for Abel Tasman Park 
   var strictBounds = new google.maps.LatLngBounds(
   //The WestSouth point and The NorthEast point for the boundary area
   new google.maps.LatLng(-41.008678,172.814941),
   new google.maps.LatLng(-40.777178,173.086853)
   ),

   lastValidCenter = strictBounds.getCenter();

   var $map = $("#map");

   $map.gmap3({
    map: {
        options: {
                // center: [-40.9382511,172.9681819],
                center: [-40.930, 173.0509],
                // center: [-41.24437,174.7618546],

                zoom: 12,
                minZoom: 11,
                disableDefaultUI: true,
                
                mapTypeControlOptions: {
                    mapTypeIds: ["style1"]
                },
                mapTypeId: "style1"
            },//end of options

            events:{  
                //For center the boundary area    
                center_changed: function(map){
                    if(strictBounds.contains(map.getCenter())){
                            //still with valid bounds, so save the last vaild position
                            lastValidCenter = map.getCenter();
                            return;
                        }
                            //not vaild anymore
                            map.panTo(lastValidCenter);
                        }
                },//end of events

        },//end of map
        
        styledmaptype:{
            //This style is number 1 style    
            id: "style1",
            options:{
            //COZ we do not want to show the style map button but we apply name to style 1
            name: "Style 1"
        },

        styles: [
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
            { "hue": "#00ffff" },
            { "color": "#1b8080" }
            ]
        },{
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
            { "color": "#F24C32" },
            { "weight": 1 }
            ]
        } 
        ]
            }//End of styledmaptype

    });//end of gmap3


/* show all categories */
$("#allButton").bind("click", function (event, ui) {
    var url = "http://intense-harbor-6396.herokuapp.com/category/all";
    // var url = "http://localhost:3000/all";
    var data = [];
    $map.gmap3("clear");

    $.get(url, function (gps) {
        data = gps;
        mapStuff(data)
    });
});

/* Show only animals */
$("#animalButton").click(function () {
    var url = "http://intense-harbor-6396.herokuapp.com/category/animals";
    // var url = "http://localhost:3000/animals";
    var data = [];
    $map.gmap3("clear");

    $.get(url, function (gps) {
        data = gps;
        mapStuff(data)
    })
});

/* show only plants */
$("#plantButton").bind("click", function () {
    var url = "http://intense-harbor-6396.herokuapp.com/category/plants";
    // var url = "http://localhost:3000/plants";
    var data = [];
    $map.gmap3("clear");

    $.get(url, function (gps) {
        data = gps;
        mapStuff(data)
    })
});

/* show only other */
$("#otherButton").bind("click", function (event, ui) {
    var url = "http://intense-harbor-6396.herokuapp.com/category/other";
    // var url = "http://localhost:3000/other";
    var data = [];
    $map.gmap3("clear");

    $.get(url, function (gps) {
        data = gps;
        mapStuff(data)
    })
});

/* Plot data onto map */
function mapStuff(data) {
    // loop through data
    $.each(data, function (key, val) {

        var animalIcon = "img/wildlife.png";
        var plantIcon = "img/palm-tree-export.png";
        var otherIcon = "img/panoramicview.png";

        if (val.category == "Plants") {
            icon = plantIcon;
        }

        else if (val.category == "Other") {
            icon = otherIcon;
        }

        else {
            icon = animalIcon;
        }

        $map.gmap3({
            marker: {
                values: [{
                    address: val.gps,
                    options: {
                        icon: icon,
                        animation: google.maps.Animation.DROP,
                    },
                    events: {
                        click: function (marker, event, context) {
                            var map = $(this).gmap3("get"),
                            infowindow = $(this).gmap3({
                                get: {
                                    name: "infowindow"
                                }
                            });
                            if (infowindow) {
                              infowindow.open(map, marker);
                              infowindow.setContent("<h4>" + val.title + "</h4><br><img src ='" + val.imageurl + "'class = 'images'/><br><p>" + val.imagedesc + "</p>");
                          }
                          else {
                            $(this).gmap3({
                                infowindow: {
                                    address: val.gps,
                                    options: {
                                        maxWidth: 200,
                                        // content: '<div class="infobox">'+val.content+'</div>',
                                        // content: val.content,
                                        content: "<h4>" + val.title + "</h4><br><img src ='" + val.imageurl + "' class = 'images'/><br><p>" + val.imagedesc + "</p>",
                                        offset: {
                                            y: -32,
                                            x: 12
                                        }
                                    }
                                }
                            });
                        }
                    }, 
                    // close current infowindow 
                    closeclick: function () {
                        var infowindow = $(this).gmap3({
                            get: {
                                name: "infowindow"
                            }
                        });
                        if (infowindow) {
                            infowindow.close();
                        }
                    }
                } // end of events options 
            }]
        } // end of marker
    });
    }); //end of loop
    } //end of mapStuff function
});