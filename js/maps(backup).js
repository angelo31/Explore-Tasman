//GMAP 3 not using so for backup
$(document).on('pageshow','#home',function(event){ 
    
       //Bounds for Abel Tasman Park 
       var strictBounds = new google.maps.LatLngBounds(
       //The WestSouth point and The NorthEast point for the boundary area
            new google.maps.LatLng(-41.26,172.63),
            new google.maps.LatLng(-40.5,173.19)
        ),

       lastValidCenter = strictBounds.getCenter();
    
      //Initalize the gmap3    id # class .    
        $("#newmap").gmap3(
            {  
            //getgeoloc able to work on the firefox not on chrome coz it ban...
                getgeoloc:{
                    callback: function(latLng){
                        if(latLng){
                            $(this).gmap3({
                            marker:{
                            latLng: latLng
                            },
                            });
                        }
                    }
                },
            //end of getgeoloc
                
               marker:{
                    // You can put arraylist over here
                    values:[
                        {latLng:[-40.938444,173.058625],data:'Frenchman &#8211 Bay <img src="image/Abel Tasman.jpg">'},//animals
                        {latLng:[-40.936624,173.058164],data:"Abel Tasman"},//plants
                        {latLng:[-40.939611,173.061179],data:"Abel Tasman Walkway", options:{icon: "http://maps.google.com/mapfiles/marker_green.png"}}//others
                           ], 
                    options:{
                        draggable:false
                    },
                    events:{
                        click:function(marker,event,context){
                            var map = $(this).gmap3("get"),
                                infowindow = $(this).gmap3({get:{name:"infowindow"}});
                        if(infowindow){
                            infowindow.open(map,marker);    
                            infowindow.setContent(context.data);
                        } else {
                            $(this).gmap3({
                            infowindow:{
                                anchor:marker,
                                options:{content: context.data}
                            }
                                });    
                            }//end of else
                        },//end of mouseover
                        
                        mouseout:function(){
                            var infowindow = $(this).gmap3({get:{name:"infowindow"}});
                            if(infowindow){
                            infowindow.close();
                            }
                        }//end of mouseout
                    }, //end of Marker events
                },//end of marker 
                
                map:{
                options:{
                    center:[-40.913, 172.981],

                    //center the central area     
                    //center:lastValidCenter, 

                    minZoom:12,
                    disableDefaultUI:true,
                    mapTypeControlOptions: {
                       mapTypeIds: ["style1"]
                    },
                    mapTypeId: "style1"
                        },
                
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
                },     
            },

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
          } //End of map 
        ); //End of gmap3  
});//End of function


//Function clear markers
